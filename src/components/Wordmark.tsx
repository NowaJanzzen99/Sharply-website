import { useId } from "react";

/*
  Sharply mark: a glass sphere with one razor cut.

  The sphere is lit from the upper left and its rim carries the same thin-film
  colours as the hero bubble (cyan, indigo, violet, a touch of warm orange). One
  straight cut takes off the lower right, and the cut face catches the light as
  a bright edge: soft on the round side, sharp on the flat one, which is the
  name in one picture.

  Pure vector, so it stays crisp from the 16px footer to the intro screen. The
  gradient ids come from useId, because several copies of the mark sit on one
  page and duplicate ids would make them borrow each other's gradients.

  Geometry: circle centre (16,16), radius 13, cut along x + y = 41. The chord
  meets the circle at (28.52,12.48) and (12.48,28.52).
*/
export function Mark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ref = (name: string) => `${uid}-${name}`;

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <defs>
        <radialGradient id={ref("body")} cx="34%" cy="28%" r="82%">
          <stop offset="0" stopColor="#e4edff" />
          <stop offset="0.28" stopColor="#7aa6ff" />
          <stop offset="0.62" stopColor="#3355e0" />
          <stop offset="1" stopColor="#111a6e" />
        </radialGradient>
        <linearGradient
          id={ref("rim")}
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#8af0ff" />
          <stop offset="0.38" stopColor="#7d86ff" />
          <stop offset="0.7" stopColor="#c07cff" />
          <stop offset="1" stopColor="#ffb98a" />
        </linearGradient>
        <linearGradient
          id={ref("facet")}
          x1="20.5"
          y1="20.5"
          x2="17.9"
          y2="17.9"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#bcd3ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={ref("gloss")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The body of the sphere, cut along the chord. */}
      <path d="M28.52 12.48A13 13 0 1 0 12.48 28.52Z" fill={`url(#${ref("body")})`} />

      {/* Soft window light in the upper left. */}
      <ellipse
        cx="11"
        cy="9.6"
        rx="4.6"
        ry="2.5"
        transform="rotate(-34 11 9.6)"
        fill={`url(#${ref("gloss")})`}
      />

      {/* The cut face, lit along its edge and fading inwards. */}
      <path d="M28.52 12.48 12.48 28.52 17.9 17.9Z" fill={`url(#${ref("facet")})`} />

      {/* Thin-film rim on the round side only. */}
      <path
        d="M28.52 12.48A13 13 0 1 0 12.48 28.52"
        stroke={`url(#${ref("rim")})`}
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* The razor edge, and a glint on each sharp corner. */}
      <path
        d="M28.52 12.48 12.48 28.52"
        stroke="#ffffff"
        strokeOpacity="0.92"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="28.52" cy="12.48" r="0.9" fill="#ffffff" fillOpacity="0.9" />
      <circle cx="12.48" cy="28.52" r="0.9" fill="#ffffff" fillOpacity="0.9" />
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
      <Mark className={markClassName ?? "h-6 w-6"} />
      <span
        className="font-display font-semibold lowercase"
        style={{ letterSpacing: "-0.045em" }}
      >
        sharply
      </span>
    </span>
  );
}
