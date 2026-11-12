import { describe, expect, it } from "vitest";

import { answerCurrentCard, createSession, type Flashcard } from "./session";

const sampleDeck: Flashcard[] = [
  { id: "card-1", prompt: "hello", answers: ["ciao", "buongiorno"] },
  { id: "card-2", prompt: "water", answers: ["acqua", "l'acqua"] },
  { id: "card-3", prompt: "coffee", answers: ["caffè", "caffe"] },
  { id: "card-4", prompt: "friend", answers: ["amico", "amica"] },
  { id: "card-5", prompt: "thanks", answers: ["grazie"] },
];

describe("createSession", () => {
  it("creates the requested number of unique cards", () => {
    const session = createSession(sampleDeck, 3);

    expect(session.total).toBe(3);
    expect(session.queue).toHaveLength(3);
    expect(new Set(session.queue.map((card) => card.id)).size).toBe(3);
    expect(session.currentCard?.id).toBe("card-1");
    expect(session.isComplete).toBe(false);
  });
});

describe("answerCurrentCard", () => {
  it("requeues a missed word until it is answered correctly", () => {
    const session = createSession(sampleDeck, 2);
    const result = answerCurrentCard(session, "nope");

    expect(result.correct).toBe(false);
    expect(result.session.queue.map((card) => card.id)).toEqual([
      "card-2",
      "card-1",
    ]);
    expect(result.session.correctCount).toBe(0);
    expect(result.session.remainingCount).toBe(2);
  });

  it("completes the session once every selected word has been answered correctly", () => {
    let session = createSession(sampleDeck, 2);

    session = answerCurrentCard(session, "ciao").session;
    session = answerCurrentCard(session, "acqua").session;

    expect(session.isComplete).toBe(true);
    expect(session.correctCount).toBe(2);
    expect(session.remainingCount).toBe(0);
    expect(session.completedCount).toBe(2);
  });

  it("tracks progress while words are repeated", () => {
    const session = createSession(sampleDeck, 2);
    const wrongAttempt = answerCurrentCard(session, "nope");
    const correctAttempt = answerCurrentCard(wrongAttempt.session, "acqua");

    expect(correctAttempt.correct).toBe(true);
    expect(correctAttempt.session.correctCount).toBe(1);
    expect(correctAttempt.session.completedCount).toBe(1);
    expect(correctAttempt.session.remainingCount).toBe(1);
  });
});
