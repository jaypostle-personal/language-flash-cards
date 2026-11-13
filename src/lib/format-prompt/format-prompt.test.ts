import { describe, expect, it } from "vitest";

import { formatPrompt } from "./format-prompt";

describe("formatPrompt", () => {
  it("returns the first meaning as primary and remaining meanings as alternatives", () => {
    expect(formatPrompt("state;condition;status")).toEqual({
      primary: "state",
      alternatives: ["condition", "status"],
    });
  });

  it("trims whitespace and ignores empty meanings", () => {
    expect(formatPrompt(" state ; ; condition ; ")).toEqual({
      primary: "state",
      alternatives: ["condition"],
    });
  });

  it("keeps a prompt without semicolons as the primary meaning", () => {
    expect(formatPrompt("not")).toEqual({ primary: "not", alternatives: [] });
  });

  it("returns empty values for an empty prompt", () => {
    expect(formatPrompt("  ")).toEqual({ primary: "", alternatives: [] });
  });
});
