/*
  The Sharply mark: one letter S drawn as a single band, round on the inside
  curves and cut to a blade point at both ends. Soft in the middle, sharp at
  the edges, which is the name in one shape.

  It is constructed, not traced: one band of constant thickness, two bowls of
  concentric arcs, bars at one shared slope and two blade cuts, the whole
  thing point-symmetric about its centre. Tracing the approved render left
  nicks where straights met curves; building it from its geometry does not.
  See reference/logo-v2/construct.py for the numbers.
  It takes the colour of the text around it (currentColor), so it is white in
  the navigation, dark on a light surface and needs no second file for either.

  The source render and the tracing script are in reference/logo-v2/.
*/
const PATH =
  "M79.735 8.000L33.498 23.921A16.900 16.900 0 0 0 39.000 56.800L61.000 56.800A3.300 3.300 0 0 1 62.074 63.220L29.627 74.393L20.265 92.000L66.502 76.079A16.900 16.900 0 0 0 61.000 43.200L39.000 43.200A3.300 3.300 0 0 1 37.926 36.780L70.373 25.607Z";

export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className ?? "h-6 w-6"}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path fill="currentColor" d={PATH} />
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
    /*
      The mark is aligned to the ink of the word, not to its line box. A line
      box carries room for accents above and descenders below, and centring on
      that puts the mark visibly high next to a lowercase word. leading-none
      trims the box to the letters, and the word is nudged by the difference
      between its ascender and its descender so the pair sits on one optical
      centre.
    */
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <Mark className={markClassName ?? "h-6 w-6"} />
      <span
        className="font-display font-semibold lowercase leading-none"
        style={{ letterSpacing: "-0.045em" }}
      >
        sharply
      </span>
    </span>
  );
}
