import { describe, expect, it } from "vitest";

import type { ItalianDeckLevel } from "@/data/italian-decks";
import { buildBalancedDeck } from "./deck-selection";
import type { Flashcard } from "./session";

function makeDeck(level: string, words: string[]): Flashcard[] {
  return words.map((word) => ({
    id: `${level.toLowerCase()}-${word}`,
    prompt: word,
    answers: [word],
  }));
}

function countByLevel(cards: Flashcard[]): Record<string, number> {
  return cards.reduce<Record<string, number>>((counts, card) => {
    const level = card.id.split("-")[0];
    counts[level] = (counts[level] ?? 0) + 1;
    return counts;
  }, {});
}

describe("buildBalancedDeck", () => {
  it("distributes cards evenly across two selected levels", () => {
    const cards = buildBalancedDeck(
      {
        A1: makeDeck("A1", ["casa", "libro", "cane", "sole"]),
        A2: makeDeck("A2", ["tempo", "amico", "città", "acqua"]),
      },
      ["A1", "A2"],
      6,
    );

    expect(cards).toHaveLength(6);
    expect(countByLevel(cards)).toEqual({ a1: 3, a2: 3 });
  });

  it("splits a non-divisible deck as evenly as possible across three levels", () => {
    const decks = {
      A1: makeDeck("A1", ["uno", "due", "tre", "quattro", "cinque"]),
      A2: makeDeck("A2", ["acqua", "pane", "latte", "frutta", "carne"]),
      B1: makeDeck("B1", ["strada", "piazza", "treno", "aereo", "nave"]),
    };

    const cards = buildBalancedDeck(decks, ["A1", "A2", "B1"], 10);

    expect(cards).toHaveLength(10);
    expect(countByLevel(cards)).toEqual({ a1: 4, a2: 3, b1: 3 });
  });

  it("deduplicates the same Italian word across selected levels and rebalances", () => {
    const cards = buildBalancedDeck(
      {
        A1: makeDeck("A1", ["casa", "libro", "cane"]),
        A2: makeDeck("A2", ["casa", "tempo", "amico"]),
      },
      ["A1", "A2"],
      5,
    );

    expect(cards).toHaveLength(5);
    expect(countByLevel(cards)).toEqual({ a1: 3, a2: 2 });
    expect(new Set(cards.map((card) => card.answers[0])).size).toBe(5);
  });

  it("deduplicates accent-only spelling differences", () => {
    const cards = buildBalancedDeck(
      {
        A1: makeDeck("A1", ["caffè", "casa"]),
        A2: makeDeck("A2", ["caffe", "tempo"]),
      },
      ["A1", "A2"],
      3,
    );

    expect(cards).toHaveLength(3);
    expect(cards.map((card) => card.answers[0])).toEqual([
      "caffè",
      "tempo",
      "casa",
    ]);
  });

  it("uses available cards from other selected levels when one level is short", () => {
    const cards = buildBalancedDeck(
      {
        A1: makeDeck("A1", ["casa"]),
        A2: makeDeck("A2", ["libro", "cane", "sole", "tempo"]),
      },
      ["A1", "A2"] satisfies ItalianDeckLevel[],
      5,
    );

    expect(cards).toHaveLength(5);
    expect(countByLevel(cards)).toEqual({ a1: 1, a2: 4 });
  });
});
