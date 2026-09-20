import { useId, type CSSProperties } from "react";

/*
  Sharply mark: a glass orb with a hard corner cut and a sharper facet inside.
  The facet reads as a glass refraction edge; the small white dot is the
  specular hit. --mark-glow adapts the facet tone to currentColor, so the same
  mark reads as glass at 16px in the footer and at 28px in the intro.
*/
export function Mark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      style={{ "--mark-glow": "color-mix(in oklch, currentColor, white 38%)" } as CSSProperties}
    >
      <defs>
        <mask id={id}>
          <rect width="24" height="24" fill="#fff" />
          <path d="M25 4 L25 25 L7.5 25 Z" fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <circle cx="12" cy="12" r="9.25" fill="currentColor" />
        <polygon
          points="12,2.75 12,12 2.75,12"
          fill="var(--mark-glow)"
        />
        <ellipse
          cx="9.25"
          cy="8.75"
          rx="2.4"
          ry="1.25"
          transform="rotate(-38 9.25 8.75)"
          fill="#fff"
          fillOpacity="0.32"
        />
      </g>
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
