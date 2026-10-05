"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mark } from "./Wordmark";

/*
  The loading screen, and the opening of the page.

  While the first screen loads, the glass bubble condenses out of a blur in
  the middle of a dark screen and the name rises beneath it. A hairline along
  the foot shows real progress: the images and fonts the first screen needs.

  Then, instead of a cut, the bubble leaves the loading screen and becomes the
  hero. It travels in an arc across the headline to the place where the hero's
  own bubble sits, and lands on it exactly: same picture, same size, same spot.
  On the way it passes over the headline, and the words seen through it are
  magnified and bent the way light bends through a soap film. The loading
  screen falls away behind it, so by the time it lands the page has arrived
  around it. One object, one movement, from the first frame to the hero.

  Once per browsing session, and never for someone arriving from an ad: they
  clicked to see something and get it straight away.

    a fresh load          play it
    a reload, a second tab, or an ad click
                          skip it before the first paint: the inline script
                          marks the document and a CSS rule hides the screen
    coming back from a
    detail page           skip it without mounting it at all (`played`)

  The inline script also holds the hero back while the screen is up: the
  headline waits to write itself until the bubble sets off, and the hero's
  bubble stays hidden until this one lands on it. A timer in the same script
  lets go of both after five seconds, so a failure here can never leave the
  hero empty.
*/

const SEEN_KEY = "sharply:intro-seen";
/** Visitors from a campaign skip the screen. */
const AD_PARAMS = "[?&](gclid|gbraid|wbraid|fbclid|msclkid|ttclid|li_fat_id|utm_[a-z]+)=";

/** Set the moment the screen has run, or been skipped, in this tab. */
let played = false;
const LETTERS = "sharply".split("");

/** Never shorter than this, so it reads as a moment and not a flicker. */
const MIN_MS = 800;
/** Never longer than this, however slow the connection. */
const MAX_MS = 2200;
/** The flight from the middle of the screen onto the hero bubble. */
const FLIGHT_MS = 1500;
/** How much the headline is magnified inside the bubble. */
const LENS = 1.32;

/** The picture both bubbles share, so the hand-over is pixel for pixel. */
const ORB = {
  src: "/images/orb.webp",
  width: 1400,
  height: 1391,
  sizes: "(min-width: 768px) 42vw, 82vw",
  className: "h-auto w-full [filter:saturate(0.82)_brightness(0.94)_hue-rotate(-8deg)]",
};

type Point = { x: number; y: number };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const quad = (a: number, b: number, c: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

function release() {
  const root = document.documentElement;
  delete root.dataset.introHold;
  delete root.dataset.introOrb;
  root.style.overflow = "";
}

export function Intro() {
  const [phase, setPhase] = useState<"loading" | "flying" | "gone">(() =>
    played ? "gone" : "loading",
  );
  const line = useRef<HTMLSpanElement>(null);
  const still = useRef<HTMLDivElement>(null);
  const flyer = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);

  // Loading: wait for the first screen, show real progress.
  useEffect(() => {
    if (played) return;

    let seen = document.documentElement.dataset.introSeen === "true";
    if (!seen) {
      try {
        seen =
          sessionStorage.getItem(SEEN_KEY) === "1" ||
          new RegExp(AD_PARAMS).test(window.location.search);
      } catch {
        // Storage blocked: treat it as seen rather than replaying on every visit.
        seen = true;
      }
    }

    if (seen) {
      played = true;
      release();
      const skip = setTimeout(() => setPhase("gone"), 0);
      return () => clearTimeout(skip);
    }

    played = true;
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

    const images = Array.from(document.images).filter((img) => img.loading !== "lazy");
    let fontsReady = false;
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    const tick = (now: number) => {
      const total = images.length + 1;
      const done = images.filter((img) => img.complete).length + (fontsReady ? 1 : 0);
      real = total > 0 ? done / total : 1;

      const elapsed = now - started;
      const pace = Math.min(1, elapsed / MIN_MS);
      const goal = elapsed > MAX_MS ? 1 : Math.min(real, pace);
      shown += (goal - shown) * 0.12;
      if (goal === 1 && shown > 0.995) shown = 1;
      if (line.current) line.current.style.transform = `scaleX(${shown.toFixed(4)})`;

      if (shown === 1 && !finished) {
        finished = true;
        setPhase("flying");
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // The flight: from the middle of the screen onto the hero bubble.
  useEffect(() => {
    if (phase !== "flying") return;

    const root = document.documentElement;
    // The headline starts writing itself as the bubble sets off.
    delete root.dataset.introHold;

    const from = still.current?.querySelector("img")?.getBoundingClientRect();
    const box = flyer.current;
    const glass = lens.current;
    const targetImg = document.querySelector<HTMLElement>("[data-orb-main] [data-orb-image]");
    const headline = document.querySelector<HTMLElement>("main h1");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = (delay: number) => {
      release();
      if (box) box.style.opacity = "0";
      return setTimeout(() => setPhase("gone"), delay);
    };

    // Nowhere to land, or no motion wanted: a plain crossfade.
    if (reduce || !from || !box || !glass || !targetImg || from.width === 0) {
      const timer = finish(450);
      return () => clearTimeout(timer);
    }

    const base = from.width;
    box.style.width = `${base}px`;
    box.style.height = `${from.height}px`;
    box.style.opacity = "1";

    // The headline as seen through the glass: a copy, frozen in its final state.
    let copy: HTMLElement | null = null;
    let words: DOMRect | null = null;
    if (headline) {
      words = headline.getBoundingClientRect();
      copy = headline.cloneNode(true) as HTMLElement;
      copy.removeAttribute("id");
      copy.classList.add("lens-copy");
      copy.style.width = `${words.width}px`;
      glass.appendChild(copy);
    }

    const start: Point = { x: from.left + from.width / 2, y: from.top + from.height / 2 };
    // Halfway, the bubble crosses the middle of the words themselves (the h1
    // box spans the whole column; a range around its text is as wide as the
    // longest line).
    let over: Point = start;
    if (headline) {
      // Text nodes only: a range around an element includes its full box.
      const walker = document.createTreeWalker(headline, NodeFilter.SHOW_TEXT);
      let l = Infinity, r = -Infinity, t = Infinity, b = -Infinity;
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const box = range.getBoundingClientRect();
        l = Math.min(l, box.left);
        r = Math.max(r, box.right);
        t = Math.min(t, box.top);
        b = Math.max(b, box.bottom);
      }
      if (Number.isFinite(l)) over = { x: (l + r) / 2, y: t + (b - t) * 0.55 };
    }

    const began = performance.now();
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const fly = (now: number) => {
      const raw = Math.min(1, (now - began) / FLIGHT_MS);
      const t = ease(raw);

      // Re-read the target every frame: the hero bubble drifts while we fly.
      const to = targetImg.getBoundingClientRect();
      const end: Point = { x: to.left + to.width / 2, y: to.top + to.height / 2 };
      const endSize = targetImg.offsetWidth;
      // A control point that puts the curve through the headline at t = 0.5.
      const control: Point = {
        x: 2 * over.x - (start.x + end.x) / 2,
        y: 2 * over.y - (start.y + end.y) / 2,
      };
      const midSize = Math.max(base * 1.25, endSize * 0.72);

      const x = quad(start.x, control.x, end.x, t);
      const y = quad(start.y, control.y, end.y, t);
      const size = quad(base, midSize * 2 - (base + endSize) / 2, endSize, t);
      const s = size / base;
      const left = x - size / 2;
      const top = y - size / 2;

      box.style.transform = `translate3d(${left.toFixed(2)}px, ${top.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;

      if (copy && words) {
        // A point v of the page shows at c + LENS * (v - c) inside the glass.
        const k = LENS / s;
        // Relative to the glass, which sits 9% in from the edge of the bubble.
        const inset = base * 0.09;
        const tx = (x + LENS * (words.left - x) - left) / s - inset;
        const ty = (y + LENS * (words.top - y) - top) / s - inset;
        copy.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${k.toFixed(4)})`;
        // The refraction is strongest in mid-flight and gone on landing.
        glass.style.opacity = Math.sin(Math.PI * Math.min(1, raw * 1.15)).toFixed(3);
      }

      if (raw < 1) {
        frame = requestAnimationFrame(fly);
      } else {
        timer = finish(320);
      }
    };

    frame = requestAnimationFrame(fly);
    return () => {
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <>
      {/* Runs before the overlay paints. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var d=document.documentElement;if(sessionStorage.getItem("${SEEN_KEY}")==="1"||new RegExp("${AD_PARAMS}").test(location.search)){d.dataset.introSeen="true"}else{d.dataset.introHold="";d.dataset.introOrb="";setTimeout(function(){delete d.dataset.introHold;delete d.dataset.introOrb},5000)}}catch(e){document.documentElement.dataset.introSeen="true"}`,
        }}
      />

      <div
        data-intro
        data-phase={phase}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: "var(--z-overlay)" }}
      >
        {/* The screen itself, which falls away once the bubble sets off. */}
        <div className="intro-bg grain pointer-events-auto absolute inset-0 bg-canvas-deep">
          <div className="intro-glow absolute left-1/2 top-[44%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.5_0.16_259/0.5)_0%,oklch(0.3_0.12_262/0.18)_45%,transparent_70%)] blur-2xl" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            ref={still}
            className="intro-still relative h-[min(34vmin,260px)] w-[min(34vmin,260px)]"
          >
            <div className="intro-orb absolute inset-0 flex items-center">
              <Image {...ORB} alt="" priority />
            </div>
          </div>

          <div className="intro-name mt-10 flex items-center gap-3 text-text">
            <Mark className="intro-mark h-8 w-8" />
            <span className="flex overflow-hidden font-display text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-none tracking-[-0.045em]">
              {LETTERS.map((letter, index) => (
                <span
                  key={index}
                  className="intro-letter inline-block pb-[0.12em]"
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* Real progress, and nothing else: a hairline along the foot. */}
        <span className="intro-meta absolute inset-x-5 bottom-6 block h-px overflow-hidden bg-hairline md:inset-x-10 md:bottom-9">
          <span
            ref={line}
            className="block h-full w-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </span>

        {/* The bubble in flight, with the headline seen through it. */}
        <div
          ref={flyer}
          className="intro-flyer absolute left-0 top-0 origin-top-left opacity-0 will-change-transform"
        >
          <Image {...ORB} alt="" loading="eager" />
          <div
            ref={lens}
            className="absolute inset-[9%] overflow-hidden rounded-full opacity-0 mix-blend-screen [mask-image:radial-gradient(circle,#000_52%,transparent_72%)]"
          />
        </div>

        {/* The bend of the glass: a slow noise that displaces what is behind it. */}
        <svg aria-hidden="true" className="absolute h-0 w-0">
          <filter id="sharply-lens" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      </div>
    </>
  );
}
