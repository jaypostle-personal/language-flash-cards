import { createContext } from "react";

import type { ItalianDeckLevel } from "@/data/italian-decks";
import type { Session } from "./session";

export type SessionContextValue = {
  session: Session | null;
  startSession: (
    deckSize: number,
    selectedLevels: readonly ItalianDeckLevel[],
  ) => Promise<void>;
  submitAnswer: (answer: string) => { correct: boolean; session: Session };
  resetSession: () => void;
};

export const SessionContext = createContext<SessionContextValue | null>(null);
