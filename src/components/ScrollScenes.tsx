"use client";

import { useEffect } from "react";

/*
  Scroll-scrubbed entrances for every card on the page.

  Any element with data-scene is driven by where it sits in the viewport, not
  by a one-off trigger: it rises out of a slight backwards tilt, grows to full
  size and comes into full light as it travels up the screen, and whatever is
  marked data-scene-img inside it drifts against its frame the whole way
  through, so the picture has depth. Scroll slowly and it moves slowly; scroll
  back and it reverses. Same principle as the services reel.

  One scroll listener and one rAF loop for the whole page, and the loop sleeps
  as soon as everything has settled. Only transform and opacity are written.

  Kinds:
    card  tilts back and rises (images, panels)
    row   slides in from the side (list rows)
  data-scene-lag="0.08" makes an element start a little later than its
  neighbour, so a pair of cards never moves as one block.
*/

type Entry = {
  el: HTMLElement;
  kind: string;
  lag: number;
  img: HTMLElement | null;
  enter: number;
  pass: number;
};

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const ease = (t: number) => 1 - (1 - t) ** 3;

export function ScrollScenes() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Scrubbed motion is driven by the visitor, so it stays, a little calmer.
    const amp = reduce ? 0.7 : 1;
    let entries: Entry[] = [];
    let frame = 0;
    let running = false;

    const collect = () => {
      entries = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((el) => ({
        el,
        kind: el.dataset.scene ?? "card",
        lag: Number(el.dataset.sceneLag ?? 0),
        img: el.querySelector<HTMLElement>("[data-scene-img]"),
        enter: 0,
        pass: 0.5,
      }));
    };

    const step = () => {
      const vh = window.innerHeight;
      let moving = false;

      entries.forEach((entry) => {
        const box = entry.el.getBoundingClientRect();
        // Hidden branches (the mobile stack on desktop) have no box: skip them.
        if (box.height === 0) return;
        // 0 when the top edge meets the bottom of the screen, 1 once it has
        // climbed to the upper third, so the whole entrance is watched.
        const enterTarget = clamp((vh - box.top) / (vh * 0.72) - entry.lag);
        // 0 to 1 over the element's whole trip across the screen.
        const passTarget = clamp((vh - box.top) / (vh + box.height));

        entry.enter += (enterTarget - entry.enter) * 0.16;
        entry.pass += (passTarget - entry.pass) * 0.16;
        if (Math.abs(enterTarget - entry.enter) > 0.0005 || Math.abs(passTarget - entry.pass) > 0.0005) {
          moving = true;
        } else {
          entry.enter = enterTarget;
          entry.pass = passTarget;
        }

        const e = ease(entry.enter);
        const rest = 1 - e;

        if (entry.kind === "row") {
          entry.el.style.transform = `translate3d(${(rest * 140 * amp).toFixed(1)}px, ${(rest * 30 * amp).toFixed(1)}px, 0) rotate(${(rest * 3 * amp).toFixed(2)}deg)`;
          entry.el.style.opacity = (0.15 + 0.85 * e).toFixed(3);
        } else {
          entry.el.style.transform = `perspective(1200px) translate3d(0, ${(rest * 170 * amp).toFixed(1)}px, 0) rotateX(${(rest * 28 * amp).toFixed(2)}deg) scale(${(1 - rest * 0.16 * amp).toFixed(4)})`;
          entry.el.style.opacity = (0.1 + 0.9 * e).toFixed(3);
        }

        if (entry.img) {
          // The picture also settles out of a zoom as the card lands.
          const drift = (entry.pass - 0.5) * -16 * amp;
          const zoom = 1.2 + rest * 0.25 * amp;
          entry.img.style.transform = `translate3d(0, ${drift.toFixed(2)}%, 0) scale(${zoom.toFixed(4)})`;
        }
      });

      if (moving) {
        frame = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(step);
    };

    // After hydration and layout, like the other observers on this page.
    const boot = requestAnimationFrame(() => {
      collect();
      entries.forEach((entry) => {
        entry.el.style.transformOrigin = "50% 100%";
        entry.el.style.willChange = "transform, opacity";
        if (entry.img) entry.img.style.willChange = "transform";
      });
      wake();
    });

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);

    return () => {
      cancelAnimationFrame(boot);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, []);

  return null;
}
