import { cn } from "@/lib/utils";
import { formatPrompt } from "@/lib/format-prompt";

type FormattedPromptProps = {
  prompt: string;
  className?: string;
  alternativeClassName?: string;
};

export function FormattedPrompt({
  prompt,
  className,
  alternativeClassName,
}: FormattedPromptProps) {
  const { primary, alternatives } = formatPrompt(prompt);

  return (
    <span
      className={cn("inline-flex flex-wrap items-baseline gap-x-1", className)}
    >
      <span>{primary}</span>
      {alternatives.length > 0 ? (
        <span className={cn("text-xl text-current/60", alternativeClassName)}>
          also: {alternatives.join(", ")}
        </span>
      ) : null}
    </span>
  );
}
