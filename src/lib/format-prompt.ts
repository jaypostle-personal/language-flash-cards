export type FormattedPrompt = {
  primary: string;
  alternatives: string[];
};

/** Split a semicolon-separated English prompt into its primary and extra meanings. */
export function formatPrompt(prompt: string): FormattedPrompt {
  const meanings = prompt
    .split(";")
    .map((meaning) => meaning.trim())
    .filter(Boolean);

  return {
    primary: meanings[0] ?? "",
    alternatives: meanings.slice(1),
  };
}
