import { describe, expect, it } from "vitest";

import { buildItalianDecks, italianDeckLevels } from "./italian-decks";

describe("buildItalianDecks", () => {
  it("maps source vocabulary into the app flashcard shape by CEFR level", () => {
    const decks = buildItalianDecks([
      {
        word: "  non  ",
        useful_for_flashcard: true,
        cefr_level: "A1",
        english_translation: "not",
        example_sentence_english: "I do not speak Italian.",
        romanization: "ignored",
        word_frequency: 7,
      },
      {
        word: "sono",
        useful_for_flashcard: true,
        cefr_level: "A2",
        english_translation: "am;are",
      },
      {
        word: "sebbene",
        useful_for_flashcard: true,
        cefr_level: "C2",
        english_translation: "although",
      },
    ]);

    expect(decks.A1).toEqual([
      {
        id: "a1-non",
        prompt: "not",
        answers: ["non"],
        exampleSentenceEnglish: "I do not speak Italian.",
      },
    ]);
    expect(decks.A2).toEqual([
      { id: "a2-sono", prompt: "am;are", answers: ["sono"] },
    ]);
    expect(decks.C2).toEqual([
      { id: "c2-sebbene", prompt: "although", answers: ["sebbene"] },
    ]);
  });

  it("initializes every supported level and ignores unsupported or unusable entries", () => {
    const decks = buildItalianDecks([
      {
        word: "ciao",
        useful_for_flashcard: false,
        cefr_level: "A1",
        english_translation: "hello",
      },
      {
        word: "salve",
        useful_for_flashcard: true,
        cefr_level: "D1",
        english_translation: "hello",
      },
      {
        word: "",
        useful_for_flashcard: true,
        cefr_level: "A2",
        english_translation: "hello",
      },
      null,
    ]);

    expect(Object.keys(decks)).toEqual(italianDeckLevels);
    expect(Object.values(decks).flat()).toEqual([]);
  });

  it("creates unique stable IDs when source words normalize to the same slug", () => {
    const entries = ["più", "piu"].map((word) => ({
      word,
      useful_for_flashcard: true,
      cefr_level: "A1",
      english_translation: "more",
    }));

    const deck = buildItalianDecks(entries).A1;

    expect(deck.map((card) => card.id)).toEqual(["a1-piu", "a1-piu-2"]);
    expect(buildItalianDecks(entries).A1).toEqual(deck);
  });
});
