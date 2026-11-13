import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { FormattedPrompt } from "@/components/FormattedPrompt";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "@/providers/use-session";

export function QuizScreen() {
  const navigate = useNavigate();
  const { session, submitAnswer } = useSession();
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    message: string;
  }>(null);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (session.isComplete) {
    return <Navigate to="/complete" replace />;
  }

  if (!session.currentCard) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = submitAnswer(input);
    const message = result.correct
      ? `Correct — ${session.currentCard?.answers[0] ?? "Great job!"} was right.`
      : `Not quite. The expected answer was: ${session.currentCard?.answers[0] ?? "Try again"}.`;

    setFeedback({ correct: result.correct, message });
    setInput("");
  };

  const progress =
    session.total === 0
      ? 0
      : ((session.total - session.remainingCount) / session.total) * 100;

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-12 text-[#1a1a1a]">
      <div className="mx-auto max-w-xl">
        <Card className="border-0 bg-white shadow-[0_20px_60px_rgba(68,35,10,0.12)]">
          <CardHeader className="gap-3">
            <div className="flex justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a2a]">
                Session progress
              </p>
              <CardDescription>
                <span className="font-bold"> {session.correctCount}</span> /
                {session.total}
              </CardDescription>
            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full bg-[#f0e6d8]"
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
          </CardHeader>

          <CardContent className="space-y-2 bg-[#fcf8f2] py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <CardTitle
                  as="h1"
                  tabIndex={-1}
                  className="text-3xl font-semibold"
                >
                  <FormattedPrompt prompt={session.currentCard.prompt} />
                </CardTitle>
                {session.currentCard.partOfSpeech ? (
                  <span
                    aria-label={`Part of speech: ${session.currentCard.partOfSpeech}`}
                    className="h-fit rounded-full border border-[#e9e1d8] bg-white px-3 py-1 text-xs capitalize text-[#6f665e]"
                  >
                    {session.currentCard.partOfSpeech}
                  </span>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                {session.currentCard.cefrLevel ? (
                  <span
                    aria-label={`CEFR level ${session.currentCard.cefrLevel}`}
                    className="rounded-full border border-[#e9e1d8] bg-white px-3 py-1 text-xs font-semibold tracking-wide text-[#6f665e]"
                  >
                    {session.currentCard.cefrLevel}
                  </span>
                ) : null}
              </div>
            </div>
            {session.currentCard.exampleSentenceEnglish ? (
              <CardDescription className="text-base italic text-[#6f665e]">
                “{session.currentCard.exampleSentenceEnglish}”
              </CardDescription>
            ) : null}
          </CardContent>

          <CardContent className="pt-0 ">
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
