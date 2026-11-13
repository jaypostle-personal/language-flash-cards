import { italianDeckLevels, type ItalianDeckLevel } from "@/data/italian-decks";
import type { Flashcard } from "../session/session";

type LevelDecks = Partial<
  Record<ItalianDeckLevel, readonly Flashcard[] | undefined>
>;

function normalizeItalianWord(word: string): string {
  return word
    .trim()
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function shuffleCards(
  cards: readonly Flashcard[],
  random: () => number,
): Flashcard[] {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

/** Select a level-balanced deck and avoid repeating the same Italian lemma. */
export function buildBalancedDeck(
  decks: LevelDecks,
  selectedLevels: readonly ItalianDeckLevel[],
  requestedSize: number,
  random: () => number = Math.random,
): Flashcard[] {
  const size = Math.max(0, Math.floor(requestedSize));
  if (size === 0) {
    return [];
  }

  const selectedLevelSet = new Set(selectedLevels);
  const buckets = italianDeckLevels
    .filter((level) => selectedLevelSet.has(level))
    .map((level) => ({
      cards: shuffleCards(decks[level] ?? [], random),
      cursor: 0,
    }));
  const selectedCards: Flashcard[] = [];
  const seenWords = new Set<string>();

  while (selectedCards.length < size) {
    let addedCardInRound = false;

    for (const bucket of buckets) {
      while (bucket.cursor < bucket.cards.length) {
        const card = bucket.cards[bucket.cursor++];
        const answer = card.answers[0];
        const normalizedWord = answer ? normalizeItalianWord(answer) : "";

        if (!card.id || !normalizedWord || seenWords.has(normalizedWord)) {
          continue;
        }

        seenWords.add(normalizedWord);
        selectedCards.push(card);
        addedCardInRound = true;
        break;
      }

      if (selectedCards.length >= size) {
        break;
      }
    }

    if (!addedCardInRound) {
      break;
    }
  }

  return selectedCards;
}
