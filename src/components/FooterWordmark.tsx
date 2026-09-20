"use client";

import { useEffect, useRef } from "react";

/*
  The oversized wordmark at the foot of the page leans away from the cursor,
  letter by letter, like something floating just under the surface. It is the
  last thing on the page and purely decorative, which is exactly the tier where
  a flourish is allowed.

  Written straight to each letter's transform inside one rAF loop: a CSS
  variable on the parent would recalculate styles for every child on every move.
*/

const LETTERS = "sharply".split("");
const REACH = 320;
const PULL = 26;

export function FooterWordmark() {
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(element.querySelectorAll<HTMLElement>("[data-letter]"));
    const current = letters.map(() => ({ x: 0, y: 0 }));
    const target = letters.map(() => ({ x: 0, y: 0 }));

    let frame = 0;
    let running = false;

    const tick = () => {
      let moving = false;
      letters.forEach((letter, index) => {
        current[index].x += (target[index].x - current[index].x) * 0.12;
        current[index].y += (target[index].y - current[index].y) * 0.12;
        if (
          Math.abs(target[index].x - current[index].x) > 0.15 ||
          Math.abs(target[index].y - current[index].y) > 0.15
        ) {
          moving = true;
        }
        letter.style.transform = `translate3d(${current[index].x.toFixed(2)}px, ${current[index].y.toFixed(2)}px, 0)`;
      });

      if (!moving) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      letters.forEach((letter, index) => {
        const box = letter.getBoundingClientRect();
        const dx = box.left + box.width / 2 - event.clientX;
        const dy = box.top + box.height / 2 - event.clientY;
        const distance = Math.hypot(dx, dy);

        if (distance > REACH) {
          target[index].x = 0;
          target[index].y = 0;
          return;
        }
        const falloff = 1 - distance / REACH;
        target[index].x = (dx / (distance || 1)) * PULL * falloff;
        target[index].y = (dy / (distance || 1)) * PULL * falloff * 0.55;
      });
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      letters.forEach((letter) => {
        letter.style.transform = "";
      });
    };
  }, []);

  return (
    <span
      ref={host}
      className="flex justify-center font-display text-[clamp(5rem,21vw,19rem)] font-semibold leading-[0.8] tracking-[-0.055em] text-text/[0.055]"
    >
      {LETTERS.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          data-letter
          className="inline-block will-change-transform"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
