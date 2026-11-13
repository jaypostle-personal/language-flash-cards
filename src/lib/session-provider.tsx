import { useCallback, useMemo, useState, type ReactNode } from "react";

import {
  answerCurrentCard,
  createSession,
  type Flashcard,
  type Session,
} from "./session";
import { SessionContext, type SessionContextValue } from "./session-context";

const starterDeck: Flashcard[] = Array.from({ length: 50 }, (_, index) => {
  const baseDeck: Flashcard[] = [
    { id: "greeting", prompt: "hello", answers: ["ciao", "buongiorno"] },
    { id: "water", prompt: "water", answers: ["acqua", "l'acqua"] },
    { id: "coffee", prompt: "coffee", answers: ["caffè", "caffe"] },
    { id: "friend", prompt: "friend", answers: ["amico", "amica"] },
    { id: "thanks", prompt: "thanks", answers: ["grazie"] },
    { id: "family", prompt: "family", answers: ["famiglia"] },
    { id: "house", prompt: "house", answers: ["casa"] },
    { id: "book", prompt: "book", answers: ["libro"] },
    { id: "school", prompt: "school", answers: ["scuola"] },
    { id: "music", prompt: "music", answers: ["musica"] },
    { id: "day", prompt: "day", answers: ["giorno"] },
    { id: "night", prompt: "night", answers: ["notte"] },
  ];

  const card = baseDeck[index % baseDeck.length];

  return {
    ...card,
    id: `${card.id}-${index}`,
  };
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const startSession = useCallback((deckSize: number) => {
    setSession(createSession(starterDeck, deckSize));
  }, []);

  const submitAnswer = useCallback(
    (answer: string): { correct: boolean; session: Session } => {
      if (!session) {
        return {
          correct: false,
          session: createSession(starterDeck, 10),
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
