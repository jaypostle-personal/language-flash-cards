import type { Flashcard } from "../lib/session/session.js";

export const italianDeckLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type ItalianDeckLevel = (typeof italianDeckLevels)[number];
export type ItalianDecks = Record<ItalianDeckLevel, Flashcard[]>;

type ItalianSourceEntry = {
  word?: unknown;
  useful_for_flashcard?: unknown;
  cefr_level?: unknown;
  english_translation?: unknown;
  example_sentence_english?: unknown;
  word_frequency?: unknown;
};

function isSourceEntry(value: unknown): value is ItalianSourceEntry {
  return typeof value === "object" && value !== null;
}

function createCardId(level: ItalianDeckLevel, word: string): string {
  const wordSlug = word
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${level.toLowerCase()}-${wordSlug || "word"}`;
}

/** Convert source vocabulary entries into level-grouped app flashcards. */
export function buildItalianDecks(entries: readonly unknown[]): ItalianDecks {
  const decks: ItalianDecks = {
    A1: [],
    A2: [],
    B1: [],
    B2: [],
    C1: [],
    C2: [],
  };
  const usedIds = new Set<string>();

  for (const value of entries) {
    if (!isSourceEntry(value) || value.useful_for_flashcard !== true) {
      continue;
    }

    const level = value.cefr_level;
    const word = typeof value.word === "string" ? value.word.trim() : "";
    const prompt =
      typeof value.english_translation === "string"
        ? value.english_translation.trim()
        : "";
    const exampleSentenceEnglish =
      typeof value.example_sentence_english === "string"
        ? value.example_sentence_english.trim()
        : "";

    if (
      !italianDeckLevels.includes(level as ItalianDeckLevel) ||
      !word ||
      !prompt
    ) {
      continue;
    }

    const deckLevel = level as ItalianDeckLevel;
    const baseId = createCardId(deckLevel, word);
    let id = baseId;
    let duplicateIndex = 2;

    while (usedIds.has(id)) {
      id = `${baseId}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedIds.add(id);
    decks[deckLevel].push({
      id,
      prompt,
      answers: [word],
      cefrLevel: deckLevel,
      ...(exampleSentenceEnglish ? { exampleSentenceEnglish } : {}),
    });
  }

  return decks;
}
