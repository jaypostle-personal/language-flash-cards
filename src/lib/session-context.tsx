import { createContext } from "react";

import type { Session } from "./session";

export type SessionContextValue = {
  session: Session | null;
  startSession: (deckSize: number) => void;
  submitAnswer: (answer: string) => { correct: boolean; session: Session };
  resetSession: () => void;
};

export const SessionContext = createContext<SessionContextValue | null>(null);
