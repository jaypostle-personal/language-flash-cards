import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { italianDeckLevels, type ItalianDeckLevel } from "@/data/italian-decks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/providers/use-session";
import {
  loadSelectedLevels,
  saveSelectedLevels,
} from "@/lib/level-preferences";

export function DeckSelectionScreen() {
  const navigate = useNavigate();
  const { startSession } = useSession();
  const [selectedLevels, setSelectedLevels] = useState(loadSelectedLevels);
  const [startingDeckSize, setStartingDeckSize] = useState<number | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  const handleLevelToggle = (level: ItalianDeckLevel) => {
    const nextLevels = selectedLevels.includes(level)
      ? selectedLevels.filter((selectedLevel) => selectedLevel !== level)
      : [...selectedLevels, level];

    if (nextLevels.length === 0) {
      return;
    }

    setSelectedLevels(nextLevels);
    saveSelectedLevels(nextLevels);
  };

  const handleStart = async (deckSize: number) => {
    setStartingDeckSize(deckSize);
    setStartError(null);

    try {
      await startSession(deckSize, selectedLevels);
      navigate("/quiz");
    } catch {
      setStartError("We couldn’t load those decks. Please try again.");
    } finally {
      setStartingDeckSize(null);
    }
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
              Choose the levels you want to practice, then pick a deck size.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-0">
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-[#41382f]">
                CEFR levels
              </legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {italianDeckLevels.map((level) => {
                  const isSelected = selectedLevels.includes(level);

                  return (
                    <label
                      key={level}
                      className={
                        "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors " +
                        (isSelected
                          ? "border-[#c45b43] bg-[#fff0e8] text-[#342d28]"
                          : "border-[#e9e1d8] bg-white text-[#54433d] hover:bg-[#fcf8f2]")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleLevelToggle(level)}
                        className="size-4 accent-[#c45b43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c45b43]"
                      />
                      {level}
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Your level selection is saved on this device. Choose at least
                one level.
              </p>
            </fieldset>

            {startError ? (
              <p role="alert" className="text-sm text-destructive">
                {startError}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-3">
              {[10, 20, 50].map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant="default"
                  className="h-16 text-base font-medium"
                  disabled={startingDeckSize !== null}
                  onClick={() => void handleStart(size)}
                >
                  {startingDeckSize === size
                    ? "Loading deck…"
                    : `${size} words`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
