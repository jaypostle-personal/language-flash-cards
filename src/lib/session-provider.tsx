import { useCallback, useMemo, useState, type ReactNode } from "react";

import { italianDeckLevels, type ItalianDeckLevel } from "@/data/italian-decks";
import { buildBalancedDeck } from "./deck-selection";
import { normalizeSelectedLevels } from "./level-preferences";
import {
  answerCurrentCard,
  createSession,
  type Flashcard,
  type Session,
} from "./session";
import { SessionContext, type SessionContextValue } from "./session-context";

const deckLoaders: Record<ItalianDeckLevel, () => Promise<Flashcard[]>> = {
  A1: async () => (await import("@/data/decks/a1.json")).default,
  A2: async () => (await import("@/data/decks/a2.json")).default,
  B1: async () => (await import("@/data/decks/b1.json")).default,
  B2: async () => (await import("@/data/decks/b2.json")).default,
  C1: async () => (await import("@/data/decks/c1.json")).default,
  C2: async () => (await import("@/data/decks/c2.json")).default,
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const startSession = useCallback(
    async (deckSize: number, selectedLevels: readonly ItalianDeckLevel[]) => {
      const levels = normalizeSelectedLevels(selectedLevels);
      const loadedDecks = await Promise.all(
        levels.map((level) => deckLoaders[level]()),
      );
      const decks = Object.fromEntries(
        levels.map((level, index) => [level, loadedDecks[index]]),
      ) as Partial<Record<ItalianDeckLevel, Flashcard[]>>;
      const deck = buildBalancedDeck(
        decks,
        italianDeckLevels.filter((level) => levels.includes(level)),
        deckSize,
      );

      setSession(createSession(deck, deckSize));
    },
    [],
  );

  const submitAnswer = useCallback(
    (answer: string): { correct: boolean; session: Session } => {
      if (!session) {
        return {
          correct: false,
          session: createSession([], 0),
        };
      }

      const result = answerCurrentCard(session, answer);
      setSession(result.session);
      return result;
    },
    [session],
  );

  const resetSession = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      startSession,
      submitAnswer,
      resetSession,
    }),
    [session, startSession, submitAnswer, resetSession],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
