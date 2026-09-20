"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { ArrowDownRight } from "@phosphor-icons/react";
import { RevealLines } from "./Reveal";
import type { Content } from "@/content";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/*
  FABLE: the real WebGL scene replaces the <picture> block below.
  Keep the image as the poster and the reduced motion fallback, keep the
  layout and the copy, and mount the canvas in the same absolutely
  positioned layer so the headline keeps its place.
*/

export function Hero({ content }: { content: Content }) {
  const section = useRef<HTMLElement>(null);

  /*
    Parallax is pure movement, so it stays off for reduced motion. Reading the
    media query through useSyncExternalStore keeps the server render and the
    hydrating render identical, which a plain branch on the query would break.
  */
  const subscribe = useCallback((notify: () => void) => {
    const query = window.matchMedia(REDUCED_MOTION);
    query.addEventListener("change", notify);
    return () => query.removeEventListener("change", notify);
  }, []);
  const parallax = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  const imageShift = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageTransform = useMotionTemplate`translate3d(0px, ${imageShift}px, 0px) scale(${imageScale})`;

  const copyShift = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyTransform = useMotionTemplate`translate3d(0px, ${copyShift}px, 0px)`;
  const copyFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={section}
      className="relative isolate grain flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-canvas-deep pb-16 pt-32 md:justify-center md:pb-24"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={parallax ? { transform: imageTransform } : undefined}
      >
        <picture>
          <source media="(min-width: 768px)" srcSet="/images/hero-orb.webp" />
          <img
            src="/images/hero-orb-portrait.webp"
            alt=""
            width={1520}
            height={2688}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[62%_22%] md:object-[72%_center]"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.09_0.022_264)_24%,oklch(0.09_0.022_264/0.86)_50%,oklch(0.09_0.022_264/0.3)_72%,transparent_94%)] md:bg-[linear-gradient(to_right,oklch(0.09_0.022_264)_18%,oklch(0.09_0.022_264/0.88)_46%,oklch(0.09_0.022_264/0.35)_68%,transparent_88%)]" />
      </motion.div>

      <motion.div
        className="container-page"
        style={parallax ? { transform: copyTransform, opacity: copyFade } : undefined}
      >
        <div>
          <h1 className="font-display text-[clamp(2.1rem,6.6vw,4.6rem)] font-semibold text-text">
            <RevealLines
              lines={[content.hero.lineOne, content.hero.lineTwo]}
              lineClassName="whitespace-nowrap"
            />
          </h1>
        </div>

        <motion.p
          className="mt-7 max-w-[46ch] text-[17px] leading-[1.55] text-text-muted md:text-[19px]"
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          {content.hero.body}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
        >
          <a
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-[16px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-accent-bright active:scale-[0.97]"
          >
            {content.hero.primary}
            <ArrowDownRight
              size={18}
              weight="bold"
              className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a>
          <a
            href="#diensten"
            className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-hairline-strong px-6 py-3.5 text-[16px] text-text transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-canvas-raised active:scale-[0.97]"
          >
            {content.hero.secondary}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
