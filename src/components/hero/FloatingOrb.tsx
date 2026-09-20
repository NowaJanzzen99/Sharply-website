"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/*
  The hero bubble.

  It is the generated still, kept exactly as it looks, and moved by hand rather
  than rebuilt in WebGL. That was the lesson from the first attempt: a shader
  bubble never matched the render, and swapping the still for it mid-load made
  the hero visibly flatten. One image, always the same image, that drifts,
  leans towards the cursor and slips away as the page scrolls.

  Everything is written straight to transforms inside a single rAF loop. React
  state would re-render the tree on every pointer move, and a CSS variable on a
  parent would restyle every child.
*/

type Layer = {
  el: HTMLElement;
  /** How strongly this layer answers the pointer. */
  pull: number;
  /** Amplitude and period of its own drift, in px and seconds. */
  driftX: number;
  driftY: number;
  period: number;
  phase: number;
  spin: number;
};

export function FloatingOrb({ compact }: { compact: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const layers: Layer[] = Array.from(
      root.querySelectorAll<HTMLElement>("[data-orb-layer]"),
    ).map((el) => ({
      el,
      pull: Number(el.dataset.pull ?? 1),
      driftX: Number(el.dataset.driftX ?? 10),
      driftY: Number(el.dataset.driftY ?? 14),
      period: Number(el.dataset.period ?? 12),
      phase: Number(el.dataset.phase ?? 0),
      spin: Number(el.dataset.spin ?? 0),
    }));

    if (layers.length === 0) return;

    // Pointer, in normalised screen space, smoothed towards its target.
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let scroll = 0;

    const onMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    if (fine && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    const readScroll = () => {
      if (reduce) return;
      const box = root.getBoundingClientRect();
      const travel = window.innerHeight + box.height;
      scroll = Math.min(1, Math.max(0, (window.innerHeight - box.top) / travel));
    };

    /*
      Reduced motion means gentler, not frozen. The bubble keeps a slow, small
      drift so the hero is not a flat photograph, but it stops answering the
      cursor and stops moving with the scroll, which are the parts that cause
      trouble for people who ask for less motion.
    */
    const calm = reduce ? 0.22 : 1;
    const slow = reduce ? 2.2 : 1;

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const seconds = (now - started) / 1000;
      eased.x += (target.x - eased.x) * 0.045;
      eased.y += (target.y - eased.y) * 0.045;
      readScroll();

      layers.forEach((layer) => {
        const wave = (seconds / (layer.period * slow) + layer.phase) * Math.PI * 2;
        const x = Math.sin(wave) * layer.driftX * calm + eased.x * 34 * layer.pull;
        const y =
          Math.cos(wave * 0.8) * layer.driftY * calm +
          eased.y * 24 * layer.pull +
          scroll * 150 * layer.pull;
        const rotate = layer.spin ? Math.sin(wave * 0.5) * layer.spin * calm : 0;
        const scale = 1 + Math.sin(wave * 0.6) * 0.012 * calm - scroll * 0.06 * layer.pull;

        layer.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={host} className="pointer-events-none absolute inset-0">
      {/* Bloom, so the bubble sits in light rather than on top of the page. */}
      <div
        data-orb-layer
        data-pull="0.35"
        data-drift-x="8"
        data-drift-y="10"
        data-period="17"
        className="absolute left-1/2 top-[42%] h-[92vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-pill)] bg-[radial-gradient(circle,oklch(0.5_0.15_259/0.45)_0%,oklch(0.32_0.12_262/0.2)_40%,transparent_70%)] blur-3xl will-change-transform md:left-[70%]"
      />

      {/* The bubble itself. */}
      <div
        data-orb-layer
        data-pull="1"
        data-drift-x="14"
        data-drift-y="20"
        data-period="13"
        data-spin="1.6"
        className={`absolute ${
          compact
            ? "left-1/2 top-[30%] w-[82vw] -translate-x-1/2 -translate-y-1/2"
            : "left-[74%] top-1/2 w-[42vw] max-w-[580px] -translate-x-1/2 -translate-y-1/2"
        } will-change-transform`}
      >
        <Image
          src="/images/orb.webp"
          alt=""
          width={1400}
          height={1391}
          sizes="(min-width: 768px) 42vw, 82vw"
          priority
          className="h-auto w-full [filter:saturate(0.82)_brightness(0.94)_hue-rotate(-8deg)]"
        />
      </div>

      {/* Two companions, drifting on their own clocks. */}
      <div
        data-orb-layer
        data-pull="1.9"
        data-drift-x="26"
        data-drift-y="34"
        data-period="9"
        data-phase="0.35"
        data-spin="4"
        className={`absolute ${
          compact ? "left-[14%] top-[54%] w-[16vw]" : "left-[46%] top-[68%] w-[7vw] max-w-[96px]"
        } will-change-transform`}
      >
        <Image
          src="/images/orb-small.webp"
          alt=""
          width={420}
          height={415}
          sizes="(min-width: 768px) 7vw, 16vw"
          className="h-auto w-full opacity-80 [filter:saturate(0.82)_brightness(0.94)_hue-rotate(-8deg)]"
        />
      </div>

      <div
        data-orb-layer
        data-pull="2.6"
        data-drift-x="34"
        data-drift-y="24"
        data-period="7.5"
        data-phase="0.7"
        data-spin="6"
        className={`absolute ${
          compact ? "right-[12%] top-[16%] w-[11vw]" : "left-[88%] top-[28%] w-[5vw] max-w-[68px]"
        } will-change-transform`}
      >
        <Image
          src="/images/orb-small.webp"
          alt=""
          width={420}
          height={415}
          sizes="(min-width: 768px) 5vw, 11vw"
          className="h-auto w-full opacity-65 [filter:saturate(0.82)_brightness(0.94)_hue-rotate(-8deg)]"
        />
      </div>
    </div>
  );
}
