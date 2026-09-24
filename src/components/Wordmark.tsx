import Image from "next/image";

/*
  The Sharply mark: a letter S cut out of faceted cobalt glass, lit from the
  upper left, with iridescent thin film along its chamfers. It is a render, not
  a vector, because the material is the point: a flat S would be any studio's
  monogram, and the glass is what ties the mark to the bubble in the hero.

  It is cut out on transparency and treated as premultiplied against black, so
  the glow at its edges stays additive and it sits on any dark surface without a
  box around it. The file is square with a small even margin, which means every
  place it is used can simply give it a square and not worry about centring.

  Replacing the mark means replacing public/images/logo-mark.webp and
  src/app/icon.png, not this file.
*/
export function Mark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo-mark.webp"
      alt=""
      width={1024}
      height={1024}
      priority
      className={className ?? "h-6 w-6"}
    />
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
