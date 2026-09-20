"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";

/*
  A short curtain: the wordmark settles, a line draws under it, then the panel
  lifts away. Roughly 1.1 seconds, once per browsing session, and never for
  anyone who asked for reduced motion. Delight is allowed at the first-time
  tier; making a returning visitor sit through it again is not.

  The page renders underneath the whole time, so nothing is waiting on this.
*/

const SEEN_KEY = "sharply:intro-seen";

export function Intro() {
  const [phase, setPhase] = useState<"hidden" | "showing" | "leaving">("hidden");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private mode or blocked storage: treat as seen and skip the curtain.
      seen = true;
    }
    if (seen) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Not being able to remember is not a reason to refuse to run.
    }

    const open = setTimeout(() => setPhase("showing"), 0);
    const lift = setTimeout(() => setPhase("leaving"), 900);
    const done = setTimeout(() => setPhase("hidden"), 1750);

    return () => {
      clearTimeout(open);
      clearTimeout(lift);
      clearTimeout(done);
    };
  }, []);

  useEffect(() => {
    if (phase === "showing") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 flex items-center justify-center bg-canvas-deep"
      style={{
        zIndex: "var(--z-overlay)",
        transform: phase === "leaving" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 820ms var(--ease-drawer)",
      }}
    >
      <div className="flex flex-col items-center">
        <span
          className="text-[clamp(1.5rem,5vw,2.5rem)] text-text"
          style={{
            animation: "intro-mark 700ms var(--ease-out) both",
          }}
        >
          <Wordmark markClassName="h-7 w-7 text-accent" />
        </span>
        <span className="mt-5 block h-px w-32 overflow-hidden bg-hairline">
          <span
            className="block h-full w-full origin-left bg-accent"
            style={{ animation: "intro-line 760ms var(--ease-out) 120ms both" }}
          />
        </span>
      </div>
    </div>
  );
}
