import { useCallback, useMemo, useState, type ReactNode } from "react";

import {
  answerCurrentCard,
  createSession,
  type Session,
} from "./session";
import { SessionContext, type SessionContextValue } from "./session-context";
import a1Deck from "@/data/decks/a1.json";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const startSession = useCallback((deckSize: number) => {
    setSession(createSession(a1Deck, deckSize));
  }, []);

  const submitAnswer = useCallback(
    (answer: string): { correct: boolean; session: Session } => {
      if (!session) {
        return {
          correct: false,
          session: createSession(a1Deck, 10),
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
