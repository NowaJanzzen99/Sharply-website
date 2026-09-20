import { useId } from "react";

/**
 * Sharply mark: a glass orb with a hard cut taken out of it.
 * Pure geometry so it stays crisp at any size.
 */
export function Mark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <mask id={id}>
        <rect width="24" height="24" fill="#fff" />
        <path d="M25 4 L25 25 L7.5 25 Z" fill="#000" />
      </mask>
      <circle cx="12" cy="12" r="9.25" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Mark className={markClassName ?? "h-5 w-5 text-accent"} />
      <span
        className="font-display font-semibold lowercase"
        style={{ letterSpacing: "-0.045em" }}
      >
        sharply
      </span>
    </span>
  );
}
