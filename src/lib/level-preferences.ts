import { italianDeckLevels, type ItalianDeckLevel } from "@/data/italian-decks";

export const LEVEL_PREFERENCES_STORAGE_KEY = "parola.selectedCefrLevels";

export type LevelPreferenceStorage = Pick<Storage, "getItem" | "setItem">;

const DEFAULT_LEVELS: ItalianDeckLevel[] = ["A1"];

export function normalizeSelectedLevels(value: unknown): ItalianDeckLevel[] {
  if (!Array.isArray(value)) {
    return [...DEFAULT_LEVELS];
  }

  const selectedLevels = italianDeckLevels.filter((level) =>
    value.includes(level),
  );

  return selectedLevels.length > 0 ? selectedLevels : [...DEFAULT_LEVELS];
}

function getBrowserStorage(): LevelPreferenceStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function loadSelectedLevels(
  storage: LevelPreferenceStorage | null = getBrowserStorage(),
): ItalianDeckLevel[] {
  if (!storage) {
    return [...DEFAULT_LEVELS];
  }

  try {
    const storedValue = storage.getItem(LEVEL_PREFERENCES_STORAGE_KEY);
    return normalizeSelectedLevels(
      storedValue ? JSON.parse(storedValue) : null,
    );
  } catch {
    return [...DEFAULT_LEVELS];
  }
}

export function saveSelectedLevels(
  levels: readonly ItalianDeckLevel[],
  storage: LevelPreferenceStorage | null = getBrowserStorage(),
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      LEVEL_PREFERENCES_STORAGE_KEY,
      JSON.stringify(normalizeSelectedLevels(levels)),
    );
  } catch {
    // Keep the session usable when browser storage is unavailable or full.
  }
}
