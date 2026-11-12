import { describe, expect, it } from "vitest";

import { isAnswerCorrect, normalizeAnswer } from "./quiz";

describe("normalizeAnswer", () => {
  it("ignores casing and indentation", () => {
    expect(normalizeAnswer("  Ciao  ")).toBe("ciao");
  });

  it("removes accent marks and apostrophes in a learner-friendly way", () => {
    expect(normalizeAnswer("L'acqua")).toBe("lacqua");
    expect(normalizeAnswer("Caffè")).toBe("caffe");
    expect(normalizeAnswer("Sì")).toBe("si");
  });

  it("collapses repeated whitespace and punctuation", () => {
    expect(normalizeAnswer("  buongiorno!  ")).toBe("buongiorno");
  });
});

describe("isAnswerCorrect", () => {
  it("accepts exact answers regardless of case and accent differences", () => {
    expect(isAnswerCorrect("caffe", ["caffè", "coffee"]))
      .toBe(true);
    expect(isAnswerCorrect("Buongiorno", ["buongiorno"]))
      .toBe(true);
  });

  it("rejects incorrect answers", () => {
    expect(isAnswerCorrect("ciao", ["buongiorno"])).toBe(false);
  });

  it("accepts alternate valid answers listed for the same prompt", () => {
    expect(isAnswerCorrect("l'acqua", ["acqua", "l acqua", "l'acqua"])).toBe(true);
  });
});
