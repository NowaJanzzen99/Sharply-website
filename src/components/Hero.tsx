"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDownRight } from "@phosphor-icons/react";
import { RevealLines } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import type { Content } from "@/content";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const OrbScene = dynamic(() => import("./hero/OrbScene"), { ssr: false });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export function Hero({ content }: { content: Content }) {
  const section = useRef<HTMLElement>(null);

  /*
    Motion is gated on the media query, read through useSyncExternalStore so the
    server render and the hydrating render stay identical.
  */
  const subscribe = useCallback((notify: () => void) => {
    const query = window.matchMedia(REDUCED_MOTION);
    query.addEventListener("change", notify);
    return () => query.removeEventListener("change", notify);
  }, []);
  const animate = useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  const [sceneReady, setSceneReady] = useState(false);
  const [mountScene, setMountScene] = useState(false);
  const [compact, setCompact] = useState(false);

  // Drivers the WebGL scene reads every frame without re-rendering React.
  const scrollDriver = useRef(0);
  const pointerDriver = useRef({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    scrollDriver.current = value;
  });

  /*
    Hold the canvas back until the headline has painted, so it never costs LCP.
    Reduced motion still gets the orb, rendered once and left still: fewer and
    gentler motion, not a downgrade to a flat photograph.
  */
  useEffect(() => {
    if (!supportsWebGL()) return;

    const reveal = () => {
      setCompact(window.matchMedia("(max-width: 767px)").matches);
      setMountScene(true);
    };

    const schedule = window.requestIdleCallback as
      | ((cb: () => void, options?: { timeout: number }) => number)
      | undefined;

    if (schedule) {
      const id = schedule(reveal, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(reveal, 400);
    return () => window.clearTimeout(timer);
  }, []);

  // Pointer, normalised and only where a real pointer exists.
  useEffect(() => {
    if (!mountScene || !animate) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      pointerDriver.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mountScene, animate]);

  const glowShift = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const glowTransform = useMotionTemplate`translate3d(0px, ${glowShift}px, 0px)`;
  const horizonShift = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const horizonTransform = useMotionTemplate`translate3d(0px, ${horizonShift}px, 0px)`;

  const copyShift = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyTransform = useMotionTemplate`translate3d(0px, ${copyShift}px, 0px)`;
  const copyFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={section}
      className="relative isolate grain flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-canvas-deep pb-16 pt-32 md:justify-center md:pb-24"
    >
      {/* Cobalt bloom behind the orb. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={animate ? { transform: glowTransform } : undefined}
      >
        <div className="absolute left-1/2 top-[38%] h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-pill)] bg-[radial-gradient(circle,oklch(0.45_0.14_259/0.5)_0%,oklch(0.3_0.12_262/0.22)_38%,transparent_70%)] blur-2xl md:left-[68%]" />
      </motion.div>

      {/* Planet rim along the bottom edge. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] opacity-90"
        style={animate ? { transform: horizonTransform } : undefined}
      >
        <Image
          src="/images/bg-horizon.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-top"
        />
      </motion.div>

      {/* Poster: the first thing painted, and the whole hero when WebGL is off. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-opacity duration-700 ease-[var(--ease-out)] ${
          sceneReady ? "opacity-0" : "opacity-100"
        }`}
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
      </div>

      {mountScene ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <OrbScene
            scroll={scrollDriver}
            pointer={pointerDriver}
            compact={compact}
            still={!animate}
            onReady={() => setSceneReady(true)}
          />
        </div>
      ) : null}

      {/* Scrim, so the headline always wins over whatever is behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,oklch(0.09_0.022_264)_24%,oklch(0.09_0.022_264/0.86)_50%,oklch(0.09_0.022_264/0.3)_72%,transparent_94%)] md:bg-[linear-gradient(to_right,oklch(0.09_0.022_264)_14%,oklch(0.09_0.022_264/0.82)_42%,oklch(0.09_0.022_264/0.25)_64%,transparent_86%)]"
      />

      <motion.div
        className="container-page"
        style={animate ? { transform: copyTransform, opacity: copyFade } : undefined}
      >
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
      </motion.div>
    </section>
  );
}
