import { Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/use-session";

export function CompletionScreen() {
  const navigate = useNavigate();
  const { session, resetSession } = useSession();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (!session.isComplete) {
    return <Navigate to="/quiz" replace />;
  }

  const firstTryResults = session.results.filter(
    (result) => result.isCorrect && result.incorrectAttempts === 0,
  );
  const reviewedResults = session.results.filter(
    (result) => result.incorrectAttempts > 0,
  );

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 py-12 text-[#1a1a1a]">
      <div className="mx-auto max-w-4xl">
        <Card className="border-0 bg-[#fffaf3] shadow-[0_20px_60px_rgba(68,35,10,0.12)]">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a2a]">
              Session complete
            </p>
            <CardTitle as="h1" tabIndex={-1} className="text-4xl font-semibold">
              Nice work!
            </CardTitle>
            <CardDescription>
              You got all {session.total} words right. Here’s how your first
              tries went and which words needed more practice.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <section
                aria-labelledby="first-try-results"
                className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"
              >
                <h2
                  id="first-try-results"
                  className="text-lg font-semibold text-emerald-950"
                >
                  Got right on the first try
                </h2>
                <p className="mt-1 text-sm text-emerald-900">
                  {firstTryResults.length} of {session.total} words
                </p>
                {firstTryResults.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {firstTryResults.map(({ card }) => (
                      <li
                        key={card.id}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-emerald-200/80 pt-3 text-sm"
                      >
                        <span className="font-medium text-emerald-950">
                          {card.prompt}
                        </span>
                        <span lang="it" className="text-emerald-900">
                          {card.answers[0]}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 border-t border-emerald-200/80 pt-3 text-sm text-emerald-900">
                    No first-try answers this round. You kept practicing and got
                    them all!
                  </p>
                )}
              </section>

              <section
                aria-labelledby="reviewed-results"
                className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5"
              >
                <h2
                  id="reviewed-results"
                  className="text-lg font-semibold text-amber-950"
                >
                  Missed, then corrected
                </h2>
                <p className="mt-1 text-sm text-amber-900">
                  {reviewedResults.length}{" "}
                  {reviewedResults.length === 1 ? "word" : "words"} to review
                </p>
                {reviewedResults.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {reviewedResults.map(({ card, incorrectAttempts }) => (
                      <li
                        key={card.id}
                        className="border-t border-amber-200/80 pt-3 text-sm"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span className="font-medium text-amber-950">
                            {card.prompt}
                          </span>
                          <span lang="it" className="text-amber-900">
                            {card.answers[0]}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-amber-900">
                          Missed {incorrectAttempts}{" "}
                          {incorrectAttempts === 1 ? "time" : "times"} before
                          getting it right.
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 border-t border-amber-200/80 pt-3 text-sm text-amber-900">
                    Perfect round—no words needed a second try.
                  </p>
                )}
              </section>
            </div>

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
