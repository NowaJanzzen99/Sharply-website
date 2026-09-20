"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDownRight } from "@phosphor-icons/react";
import { RevealLines } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { FloatingOrb } from "./hero/FloatingOrb";
import type { Content } from "@/content";

/*
  One bubble, one image, from the first paint onwards. An earlier version faded
  a WebGL orb in over the still once the canvas was ready, and the hero visibly
  flattened at the swap. The still is the better render, so it stays and the
  motion is built around it instead.
*/

export function Hero({ content }: { content: Content }) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(query.matches);
    const timer = setTimeout(sync, 0);
    query.addEventListener("change", sync);
    return () => {
      clearTimeout(timer);
      query.removeEventListener("change", sync);
    };
  }, []);

  return (
    <section className="relative isolate grain flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-canvas-deep pb-16 pt-32 md:justify-center md:pb-24">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <FloatingOrb compact={compact} />
      </div>

      {/* Planet rim along the bottom edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] opacity-90 [mask-image:linear-gradient(to_top,black_45%,transparent)]"
      >
        <Image
          src="/images/bg-horizon.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-top"
        />
      </div>

      {/* Scrim, so the headline always wins over whatever is behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,oklch(0.09_0.022_264)_22%,oklch(0.09_0.022_264/0.84)_48%,oklch(0.09_0.022_264/0.28)_70%,transparent_92%)] md:bg-[linear-gradient(to_right,oklch(0.09_0.022_264)_12%,oklch(0.09_0.022_264/0.78)_40%,oklch(0.09_0.022_264/0.2)_62%,transparent_84%)]"
      />

      <div className="container-page">
        <h1 className="font-display text-[clamp(2.1rem,6.6vw,4.6rem)] font-semibold text-text">
          <RevealLines
            lines={[content.hero.lineOne, content.hero.lineTwo]}
            lineClassName="whitespace-nowrap"
          />
        </h1>

        <p
          data-reveal-hero
          style={{ animationDelay: "0.34s" }}
          className="mt-7 max-w-[46ch] text-[17px] leading-[1.55] text-text-muted md:text-[19px]"
        >
          {content.hero.body}
        </p>

        <div
          data-reveal-hero
          style={{ animationDelay: "0.44s" }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <MagneticButton
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-[16px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-accent-bright active:scale-[0.97]"
          >
            {content.hero.primary}
            <ArrowDownRight
              size={18}
              weight="bold"
              className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </MagneticButton>
          <MagneticButton
            href="#diensten"
            className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-hairline-strong px-6 py-3.5 text-[16px] text-text transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-canvas-raised active:scale-[0.97]"
          >
            {content.hero.secondary}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
