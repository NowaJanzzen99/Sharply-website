"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "./Wordmark";

/*
  The loading screen.

  It covers the page from the very first paint, so nobody sees the site
  assemble itself, and it measures real progress: the images and fonts the
  first screen needs. A counter and a hairline follow that progress, the glass
  bubble condenses out of a blur while the name rises letter by letter, and
  when the page is ready the bubble bursts and the site comes forward out of
  the burst. The hero bubble does the same thing later on scroll, so the first
  and last thing the visitor sees of the intro is the idea the page is built on.

  Once per browsing session. A small inline script reads that before the first
  paint, so a returning visitor never even sees a flash of it. If script fails
  altogether, a CSS failsafe removes the screen after a few seconds anyway.
*/

const SEEN_KEY = "sharply:intro-seen";
const LETTERS = "sharply".split("");

/** Never shorter than this, so it reads as a moment and not a flicker. */
const MIN_MS = 1500;
/** Never longer than this, however slow the connection. */
const MAX_MS = 4200;

export function Intro() {
  const [phase, setPhase] = useState<"loading" | "bursting" | "gone">("loading");
  const count = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (document.documentElement.dataset.introSeen === "true") {
      const skip = setTimeout(() => setPhase("gone"), 0);
      return () => clearTimeout(skip);
    }

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Not being able to remember is not a reason to refuse to run.
    }

    document.documentElement.style.overflow = "hidden";

    const started = performance.now();
    let real = 0;
    let shown = 0;
    let frame = 0;
    let finished = false;

    // What the first screen needs: its images and the web fonts.
    const images = Array.from(document.images).filter((img) => img.loading !== "lazy");
    let fontsReady = false;
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    const measure = () => {
      const total = images.length + 1;
      const done = images.filter((img) => img.complete).length + (fontsReady ? 1 : 0);
      real = total > 0 ? done / total : 1;
    };

    const tick = (now: number) => {
      measure();
      const elapsed = now - started;
      // Progress may not run ahead of the minimum time, and is forced home at the maximum.
      const pace = Math.min(1, elapsed / MIN_MS);
      const goal = elapsed > MAX_MS ? 1 : Math.min(real, pace);
      shown += (goal - shown) * 0.09;
      if (goal === 1 && shown > 0.995) shown = 1;

      if (count.current) count.current.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      if (line.current) line.current.style.transform = `scaleX(${shown.toFixed(4)})`;

      if (shown === 1 && !finished) {
        finished = true;
        setPhase("bursting");
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase !== "bursting") return;
    document.documentElement.style.overflow = "";
    const done = setTimeout(() => setPhase("gone"), 1000);
    return () => clearTimeout(done);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <>
      {/* Runs before the overlay paints: a returning visitor never sees it. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("${SEEN_KEY}")==="1")document.documentElement.dataset.introSeen="true"}catch(e){document.documentElement.dataset.introSeen="true"}`,
        }}
      />
      <div
        data-intro
        data-phase={phase}
        aria-hidden="true"
        className="grain fixed inset-0 overflow-hidden bg-canvas-deep"
        style={{ zIndex: "var(--z-overlay)" }}
      >
        {/* A cobalt glow that breathes behind the bubble. */}
        <div className="intro-glow absolute left-1/2 top-[44%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.5_0.16_259/0.5)_0%,oklch(0.3_0.12_262/0.18)_45%,transparent_70%)] blur-2xl" />

        <div className="intro-stage absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative h-[min(34vmin,260px)] w-[min(34vmin,260px)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/orb-small.webp"
              alt=""
              className="intro-orb absolute inset-0 h-full w-full [filter:saturate(0.85)_hue-rotate(-8deg)]"
            />
            <span className="intro-ring absolute inset-[4%] rounded-full border border-[oklch(0.88_0.08_230/0.85)]" />
            <span className="intro-ring intro-ring-late absolute inset-[4%] rounded-full border border-[oklch(0.8_0.12_300/0.6)]" />
            {Array.from({ length: 14 }, (_, index) => {
              const angle = (index / 14) * Math.PI * 2;
              const reach = 150 + (index % 3) * 45;
              return (
                <span
                  key={index}
                  className="intro-drop absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[radial-gradient(circle_at_32%_30%,white,oklch(0.85_0.09_230)_50%,oklch(0.6_0.16_270/0.5))]"
                  style={
                    {
                      "--tx": `${(Math.cos(angle) * reach).toFixed(0)}px`,
                      "--ty": `${(Math.sin(angle) * reach + 40).toFixed(0)}px`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>

          <div className="mt-10 flex items-center gap-3 text-text">
            <Mark className="intro-mark h-8 w-8" />
            <span className="flex overflow-hidden font-display text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-none tracking-[-0.045em]">
              {LETTERS.map((letter, index) => (
                <span
                  key={index}
                  className="intro-letter inline-block pb-[0.12em]"
                  style={{ animationDelay: `${260 + index * 55}ms` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* Real progress: a counter and a hairline along the bottom. */}
        <div className="intro-meta absolute inset-x-0 bottom-0 px-5 pb-6 md:px-10 md:pb-9">
          <div className="flex justify-end font-mono text-[12px]">
            <span ref={count} className="tabular-nums text-text-muted">
              000
            </span>
          </div>
          <span className="mt-3 block h-px w-full overflow-hidden bg-hairline">
            <span
              ref={line}
              className="block h-full w-full origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
        </div>
      </div>
    </>
  );
}
