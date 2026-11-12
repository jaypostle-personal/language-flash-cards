import { isAnswerCorrect } from "./quiz";

export type Flashcard = {
  id: string;
  prompt: string;
  answers: string[];
};

export type Session = {
  total: number;
  queue: Flashcard[];
  correctAnswers: string[];
  correctCount: number;
  completedCount: number;
  remainingCount: number;
  currentCard: Flashcard | null;
  isComplete: boolean;
};

export function createSession(deck: Flashcard[], size = 10): Session {
  const uniqueCards = new Map<string, Flashcard>();

  for (const card of deck) {
    if (!card?.id) {
      continue;
    }

    uniqueCards.set(card.id, card);
  }

  const selected = [...uniqueCards.values()].slice(0, Math.max(0, size));
  const queue = selected.length > 0 ? [...selected] : [];

  return {
    total: queue.length,
    queue,
    correctAnswers: [],
    correctCount: 0,
    completedCount: 0,
    remainingCount: queue.length,
    currentCard: queue[0] ?? null,
    isComplete: queue.length === 0,
  };
}

export function answerCurrentCard(
  session: Session,
  submittedAnswer: string,
): { correct: boolean; session: Session } {
  if (session.queue.length === 0 || !session.currentCard) {
    return {
      correct: false,
      session,
    };
  }

  const currentCard = session.currentCard;
  const nextQueue = [...session.queue];
  const isCorrect = isAnswerCorrect(submittedAnswer, currentCard.answers);

  if (isCorrect) {
    nextQueue.shift();

    const correctAnswers = [...session.correctAnswers, currentCard.id];
    const nextSession: Session = {
      ...session,
      queue: nextQueue,
      correctAnswers,
      correctCount: correctAnswers.length,
      completedCount: correctAnswers.length,
      remainingCount: nextQueue.length,
      currentCard: nextQueue[0] ?? null,
      isComplete: nextQueue.length === 0,
    };

    return { correct: true, session: nextSession };
  }

  const [firstCard, ...rest] = nextQueue;
  const requeuedQueue = [...rest, firstCard];

  const nextSession: Session = {
    ...session,
    queue: requeuedQueue,
    remainingCount: requeuedQueue.length,
    currentCard: requeuedQueue[0] ?? null,
    isComplete: false,
  };

  return { correct: false, session: nextSession };
}
