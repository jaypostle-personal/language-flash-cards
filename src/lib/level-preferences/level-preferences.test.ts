import { describe, expect, it } from "vitest";

import {
  LEVEL_PREFERENCES_STORAGE_KEY,
  loadSelectedLevels,
  normalizeSelectedLevels,
  saveSelectedLevels,
  type LevelPreferenceStorage,
} from "./level-preferences";

function createMemoryStorage(
  initialValues: Record<string, string> = {},
): LevelPreferenceStorage & { values: Map<string, string> } {
  const values = new Map(Object.entries(initialValues));

  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

describe("CEFR level preferences", () => {
  it("defaults to A1 when no usable level selection exists", () => {
    expect(normalizeSelectedLevels(null)).toEqual(["A1"]);
    expect(normalizeSelectedLevels([])).toEqual(["A1"]);
    expect(loadSelectedLevels(createMemoryStorage())).toEqual(["A1"]);
  });

  it("keeps valid unique levels in CEFR order", () => {
    expect(normalizeSelectedLevels(["C2", "A2", "A2", "invalid"])).toEqual([
      "A2",
      "C2",
    ]);
  });

  it("restores the saved level selection", () => {
    const storage = createMemoryStorage({
      [LEVEL_PREFERENCES_STORAGE_KEY]: JSON.stringify(["B1", "A1"]),
    });

    expect(loadSelectedLevels(storage)).toEqual(["A1", "B1"]);
  });

  it("saves only the selected CEFR levels", () => {
    const storage = createMemoryStorage();
    saveSelectedLevels(["B2", "A2"], storage);

    expect(storage.getItem(LEVEL_PREFERENCES_STORAGE_KEY)).toBe(
      JSON.stringify(["A2", "B2"]),
    );
    expect([...storage.values.keys()]).toEqual([LEVEL_PREFERENCES_STORAGE_KEY]);
  });

  it("falls back to A1 when saved data is malformed", () => {
    const storage = createMemoryStorage({
      [LEVEL_PREFERENCES_STORAGE_KEY]: "not-json",
    });

    expect(loadSelectedLevels(storage)).toEqual(["A1"]);
  });
});
