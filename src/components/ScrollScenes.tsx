"use client";

import { useEffect } from "react";

/*
  Scroll-scrubbed entrances for the page's cards and panels.

  Every element with data-scene is driven by where it sits in the viewport,
  not by a one-off trigger, and travels back out the same way if you scroll
  up: scroll slowly and it moves slowly, stop and it holds. One rAF loop for
  the whole page, asleep whenever nothing is moving. Only transform and
  opacity are written.

  Three kinds, each with its own character, because a single move repeated on
  every card is what makes a page read as a template rather than as design:

    photo  a project shot or the manifesto image. Slides in on its own axis
           and rotates a touch as it lands, sharing the six-way vocabulary
           (left/right/up/center/circle/diagonal) that RevealImage and the
           services reel already use, so "left" always means the same kind of
           motion wherever it appears on the page. Decorative, so it can
           afford the flourish.
    panel  a glass panel with real content: the demo's controls and preview,
           the contact form, a text-only callout card. Reads as calmer and
           more direct on purpose, since it is something to use, not to look
           at: a straight slide with no rotation, shorter travel, quicker.
    row    a line in a list (a step in the process rail). Slides in from the
           side, already distinct from the two above.

  Direction comes from data-scene-variant, or, failing that, from the variant
  already sitting on a RevealImage child (its data-variant), so most photo
  cards need no extra markup at all.
*/

type Kind = "photo" | "panel" | "row";

type Vector = { dx: number; dy: number; rot: number; zoom: number };

/** Shared with RevealImage and the services reel: one name, one direction, everywhere. */
const PHOTO_VECTORS: Record<string, Vector> = {
  left: { dx: -100, dy: 14, rot: -2.4, zoom: 0.1 },
  right: { dx: 100, dy: 14, rot: 2.4, zoom: 0.1 },
  up: { dx: 0, dy: 140, rot: 0, zoom: 0.08 },
  center: { dx: 0, dy: 60, rot: 0, zoom: 0.16 },
  circle: { dx: 0, dy: 44, rot: 4, zoom: 0.2 },
  diagonal: { dx: 78, dy: 72, rot: -3.4, zoom: 0.1 },
};

const PANEL_VECTORS: Record<string, Vector> = {
  left: { dx: -70, dy: 0, rot: 0, zoom: 0.03 },
  right: { dx: 70, dy: 0, rot: 0, zoom: 0.03 },
  up: { dx: 0, dy: 60, rot: 0, zoom: 0.03 },
};

type Entry = {
  el: HTMLElement;
  kind: Kind;
  vector: Vector;
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
      entries = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((el) => {
        const kind = (el.dataset.scene || "photo") as Kind;
        const named =
          el.dataset.sceneVariant ??
          el.querySelector<HTMLElement>("[data-img-reveal]")?.dataset.variant ??
          "up";
        const table = kind === "panel" ? PANEL_VECTORS : PHOTO_VECTORS;
        return {
          el,
          kind,
          vector: table[named] ?? PHOTO_VECTORS.up,
          lag: Number(el.dataset.sceneLag ?? 0),
          img: el.querySelector<HTMLElement>("[data-scene-img]"),
          enter: 0,
          pass: 0.5,
        };
      });
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
        const { dx, dy, rot, zoom } = entry.vector;

        if (entry.kind === "row") {
          entry.el.style.transform = `translate3d(${(rest * 140 * amp).toFixed(1)}px, ${(rest * 30 * amp).toFixed(1)}px, 0) rotate(${(rest * 3 * amp).toFixed(2)}deg)`;
          entry.el.style.opacity = (0.15 + 0.85 * e).toFixed(3);
        } else if (entry.kind === "panel") {
          // Direct: a slide and a fade, nothing rotating. Something to use,
          // not to admire, so the motion stays out of the way of reading it.
          entry.el.style.transform = `translate3d(${(rest * dx * amp).toFixed(1)}px, ${(rest * dy * amp).toFixed(1)}px, 0) scale(${(1 - rest * zoom * amp).toFixed(4)})`;
          entry.el.style.opacity = (0.25 + 0.75 * e).toFixed(3);
        } else {
          // Photo: its own axis and a touch of rotation, so six neighbouring
          // cards read as six separate things arriving rather than one card
          // repeated. transform-origin is set per element below to match.
          entry.el.style.transform = `translate3d(${(rest * dx * amp).toFixed(1)}px, ${(rest * dy * amp).toFixed(1)}px, 0) rotate(${(rest * rot * amp).toFixed(2)}deg) scale(${(1 - rest * zoom * amp).toFixed(4)})`;
          entry.el.style.opacity = (0.1 + 0.9 * e).toFixed(3);
        }

        if (entry.img) {
          // The picture also settles out of a zoom as the card lands.
          const drift = (entry.pass - 0.5) * -16 * amp;
          const imgZoom = 1.2 + rest * 0.25 * amp;
          entry.img.style.transform = `translate3d(0, ${drift.toFixed(2)}%, 0) scale(${imgZoom.toFixed(4)})`;
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
        entry.el.style.transformOrigin =
          entry.kind === "photo" && entry.vector === PHOTO_VECTORS.up ? "50% 100%" : "50% 50%";
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
