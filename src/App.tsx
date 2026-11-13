import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import UiPreview from "@/dev/UiPreview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SessionProvider } from "@/lib/session-provider";
import { useSession } from "@/lib/use-session";

import "./App.css";

function App() {
  if (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("ui-preview")
  ) {
    return <UiPreview />;
  }

  return (
    <SessionProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SessionProvider>
  );
}

function AppRoutes() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.querySelector<HTMLElement>("main h1")?.focus();
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<DeckSelectionScreen />} />
      <Route path="/quiz" element={<QuizScreen />} />
      <Route path="/complete" element={<CompletionScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

function DeckSelectionScreen() {
  const navigate = useNavigate();
  const { startSession } = useSession();

  const handleStart = (deckSize: number) => {
    startSession(deckSize);
    navigate("/quiz");
  };

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 py-12 text-[#1a1a1a]">
      <div className="mx-auto max-w-3xl">
        <Card className="border-0 bg-[#fffaf3] shadow-[0_20px_60px_rgba(68,35,10,0.12)]">
          <CardHeader className="gap-3 pb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a2a]">
              Parola
            </p>
            <CardTitle
              as="h1"
              tabIndex={-1}
              className="text-4xl font-semibold tracking-tight md:text-5xl"
            >
              Italian, one word at a time.
            </CardTitle>
            <CardDescription className="text-base text-[#54433d]">
              Pick a deck size and practice in a focused, in-memory session.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-0">
            <div className="grid gap-4 sm:grid-cols-3">
              {[10, 20, 50].map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant="default"
                  className="h-16 text-base font-medium"
                  onClick={() => handleStart(size)}
                >
                  {size} words
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function QuizScreen() {
  const navigate = useNavigate();
  const { session, submitAnswer } = useSession();
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    message: string;
  }>(null);

  if (!session || !session.currentCard) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = submitAnswer(input);

    const message = result.correct
      ? `Correct — ${session.currentCard?.answers[0] ?? "Great job!"} was right.`
      : `Not quite. The expected answer was: ${session.currentCard?.answers[0] ?? "Try again"}.`;

    setFeedback({ correct: result.correct, message });
    setInput("");

    if (result.session.isComplete) {
      navigate("/complete");
    }
  };

  const progress =
    session.total === 0
      ? 0
      : ((session.total - session.remainingCount) / session.total) * 100;

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-12 text-[#1a1a1a]">
      <div className="mx-auto max-w-xl">
        <Card className="border-0 bg-white shadow-[0_20px_60px_rgba(68,35,10,0.12)]">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a2a]">
              Session progress
            </p>
            <div
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#f0e6d8]"
              role="progressbar"
              aria-label="Session progress"
              aria-valuemin={0}
              aria-valuemax={session.total}
              aria-valuenow={session.total - session.remainingCount}
              aria-valuetext={`${session.total - session.remainingCount} of ${session.total} words completed`}
            >
              <div
                className="h-full rounded-full bg-[#7a9b72] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <CardTitle
              as="h1"
              tabIndex={-1}
              className="pt-3 text-3xl font-semibold"
            >
              {session.currentCard.prompt}
            </CardTitle>
            <CardDescription>
              {session.remainingCount} left in this round.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label
                className="block text-sm font-medium text-[#41382f]"
                htmlFor="answer"
              >
                Type the Italian answer
              </label>
              <Input
                id="answer"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your answer..."
                autoComplete="off"
                spellCheck={false}
                required
                autoFocus
              />
              <p className="-mt-2 text-sm text-muted-foreground">
                Capitalization and accents do not need to be exact.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <Button type="submit" className="flex-1">
                  Check answer
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/")}
                >
                  Exit
                </Button>
              </div>
            </form>

            {feedback ? (
              <div
                role="status"
                aria-live="polite"
                className={
                  "mt-5 rounded-xl border px-3 py-2 text-sm " +
                  (feedback.correct
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-amber-200 bg-amber-50 text-amber-900")
                }
              >
                {feedback.message}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function CompletionScreen() {
  const navigate = useNavigate();
  const { session, resetSession } = useSession();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (!session.isComplete) {
    return <Navigate to="/quiz" replace />;
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 py-12 text-[#1a1a1a]">
      <div className="mx-auto max-w-lg">
        <Card className="border-0 bg-[#fffaf3] shadow-[0_20px_60px_rgba(68,35,10,0.12)]">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a2a]">
              Session complete
            </p>
            <CardTitle as="h1" tabIndex={-1} className="text-4xl font-semibold">
              Nice work!
            </CardTitle>
            <CardDescription>
              You answered {session.correctCount} of {session.total} words
              correctly.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                resetSession();
                navigate("/");
              }}
            >
              Start another deck
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function NotFoundScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f1ea] px-4">
      <Card className="max-w-md border-0 bg-[#fffaf3] text-center shadow-[0_20px_60px_rgba(68,35,10,0.12)]">
        <CardHeader>
          <CardTitle as="h1" tabIndex={-1} className="text-3xl font-semibold">
            Page not found
          </CardTitle>
          <CardDescription>
            That route doesn’t exist yet. Head back to the home deck screen.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button type="button" onClick={() => window.location.assign("/")}>
            Back home
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
