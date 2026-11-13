import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/use-session";

export function DeckSelectionScreen() {
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
