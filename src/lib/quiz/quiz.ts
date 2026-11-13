export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isAnswerCorrect(
  answer: string,
  acceptedAnswers: string[],
): boolean {
  const normalizedAnswer = normalizeAnswer(answer);

  return acceptedAnswers.some((acceptedAnswer) => {
    if (!acceptedAnswer || acceptedAnswer.trim() === "") {
      return false;
    }

    return normalizeAnswer(acceptedAnswer) === normalizedAnswer;
  });
}
