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
    // Phone tilt, in the same -1 to 1 space, measured from wherever the phone
    // was first held rather than from flat, so it feels natural in the hand.
    const tilt = { x: 0, y: 0 };
    let base: { gamma: number; beta: number } | null = null;
    let scroll = 0;

    const onMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    // Answering the cursor stays on for reduced motion too, at half strength
    // (see `gentle` below): it is movement the visitor asked for by moving.
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    /*
      On a touch device the bubble answers the phone being tilted instead of a
      cursor. Android delivers orientation straight away. iOS only does after an
      explicit permission prompt, which the platform requires to come from a tap,
      so the first tap anywhere on the page asks for it.
    */
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));

    const onOrient = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      if (!base) base = { gamma: event.gamma, beta: event.beta };
      tilt.x = clamp((event.gamma - base.gamma) / 22);
      tilt.y = clamp((event.beta - base.beta) / 22);
    };

    const onTurn = () => {
      base = null;
    };

    const startOrientation = () => {
      window.addEventListener("deviceorientation", onOrient, { passive: true });
      window.addEventListener("orientationchange", onTurn);
    };

    let askForPermission: (() => void) | null = null;

    if (!fine && !reduce && "DeviceOrientationEvent" in window) {
      const Orientation = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

      if (typeof Orientation.requestPermission === "function") {
        askForPermission = () => {
          Orientation.requestPermission?.()
            .then((result) => {
              if (result === "granted") startOrientation();
            })
            .catch(() => {});
        };
        window.addEventListener("touchend", askForPermission, { once: true });
      } else {
        startOrientation();
      }
    }

    /** How far the hero has scrolled away: 0 at the top of the page, 1 once it is gone. */
    const readScroll = () => {
      const box = root.getBoundingClientRect();
      scroll = Math.min(1, Math.max(0, -box.top / Math.max(box.height, 1)));
    };

    /*
      Reduced motion means gentler, not frozen. A bubble that hangs there like a
      photograph is a flat hero, and on a Mac with "Reduce motion" switched on
      that is exactly what the first version gave: drift so small it read as
      still. The slow float and the cursor answer stay, at most of their
      strength. What goes is the spin, the scale wobble and the burst on scroll.
    */
    const calm = reduce ? 0.85 : 1;
    const slow = reduce ? 1.15 : 1;
    const gentle = reduce ? 0.55 : 1;

    /*
      The pop. As the hero scrolls away each bubble bursts once the page has
      carried it most of the way out: it swells, thins to nothing and, for the
      big one, throws a ring and a few droplets. Scrolling back up re-inflates
      it. Each layer names its own moment in data-pop-at, so the small ones go
      first and the big one last, in the order they leave the screen.
    */
    type Pop = { at: number; value: number; base: number; image: HTMLElement | null };
    const pops = new Map<HTMLElement, Pop>();
    layers.forEach(({ el }) => {
      if (el.dataset.popAt === undefined) return;
      pops.set(el, {
        at: Number(el.dataset.popAt),
        value: 0,
        base: Number(el.dataset.baseOpacity ?? 1),
        image: el.querySelector<HTMLElement>("[data-orb-image]"),
      });
    });

    const mainLayer = root.querySelector<HTMLElement>("[data-orb-main]");
    const ring = root.querySelector<HTMLElement>("[data-pop-ring]");
    const drops = Array.from(root.querySelectorAll<HTMLElement>("[data-pop-drop]"));
    let radius = mainLayer ? mainLayer.offsetWidth / 2 : 0;
    const measure = () => {
      radius = mainLayer ? mainLayer.offsetWidth / 2 : 0;
    };
    window.addEventListener("resize", measure);

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const seconds = (now - started) / 1000;
      const aimX = fine ? target.x : tilt.x;
      const aimY = fine ? target.y : tilt.y;
      const follow = fine ? 0.045 : 0.07;
      eased.x += (aimX - eased.x) * follow;
      eased.y += (aimY - eased.y) * follow;
      readScroll();

      layers.forEach((layer) => {
        const wave = (seconds / (layer.period * slow) + layer.phase) * Math.PI * 2;
        const x =
          Math.sin(wave) * layer.driftX * calm +
          eased.x * (fine ? 34 : 46) * layer.pull * gentle;
        const y =
          Math.cos(wave * 0.8) * layer.driftY * calm +
          eased.y * (fine ? 24 : 34) * layer.pull * gentle +
          // The bubble trails the page a little, so it stays in view longer.
          scroll * 190 * layer.pull * gentle;
        const rotate = !reduce && layer.spin ? Math.sin(wave * 0.5) * layer.spin : 0;
        const scale = reduce
          ? 1
          : 1 + Math.sin(wave * 0.6) * 0.012 - scroll * 0.05 * layer.pull;

        layer.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      });

      pops.forEach((pop, element) => {
        pop.value += ((scroll > pop.at ? 1 : 0) - pop.value) * 0.16;
        const p = pop.value < 0.001 ? 0 : pop.value > 0.999 ? 1 : pop.value;

        if (pop.image) {
          pop.image.style.opacity = String((pop.base * Math.max(0, 1 - p * 1.35)).toFixed(3));
          pop.image.style.transform = reduce ? "" : `scale(${(1 + p * 0.34).toFixed(3)})`;
        }

        if (element === mainLayer && !reduce) {
          const burst = Math.sin(p * Math.PI);

          if (ring) {
            ring.style.opacity = (burst * 0.6).toFixed(3);
            ring.style.transform = `scale(${(0.88 + p * 1.0).toFixed(3)})`;
          }

          drops.forEach((drop, index) => {
            const angle = (index / drops.length) * Math.PI * 2 + 0.4;
            const reach = radius * (0.85 + (index % 3) * 0.3) * p;
            drop.style.opacity = (burst * 0.9).toFixed(3);
            drop.style.transform = `translate3d(${(Math.cos(angle) * reach).toFixed(1)}px, ${(Math.sin(angle) * reach).toFixed(1)}px, 0) scale(${(1 - p * 0.55).toFixed(3)})`;
          });
        }
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("orientationchange", onTurn);
      if (askForPermission) window.removeEventListener("touchend", askForPermission);
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

      {/* The bubble itself. It bursts once the page has carried it most of the way out. */}
      <div
        data-orb-layer
        data-orb-main
        data-pull="1"
        data-drift-x="18"
        data-drift-y="26"
        data-period="11"
        data-spin="1.6"
        data-pop-at="0.7"
        data-base-opacity="1"
        className={`absolute ${
          compact
            ? "left-1/2 top-[30%] w-[82vw] -translate-x-1/2 -translate-y-1/2"
            : "left-[74%] top-1/2 w-[42vw] max-w-[580px] -translate-x-1/2 -translate-y-1/2"
        } will-change-transform`}
      >
        <Image
          data-orb-image
          src="/images/orb.webp"
          alt=""
          width={1400}
          height={1391}
          sizes="(min-width: 768px) 42vw, 82vw"
          priority
          className="h-auto w-full [filter:saturate(0.82)_brightness(0.94)_hue-rotate(-8deg)]"
        />

        {/* The shock ring and droplets of the burst. Invisible until it happens. */}
        <span
          aria-hidden="true"
          data-pop-ring
          className="absolute inset-[3%] rounded-full border border-[oklch(0.82_0.1_259/0.7)] opacity-0 will-change-transform"
        />
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            data-pop-drop
            className="absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[oklch(0.86_0.09_259)] opacity-0 will-change-transform"
          />
        ))}
      </div>

      {/* Two companions, drifting on their own clocks. */}
      <div
        data-orb-layer
        data-pull="1.9"
        data-drift-x="30"
        data-drift-y="38"
        data-period="8.5"
        data-phase="0.35"
        data-spin="4"
        data-pop-at="0.5"
        data-base-opacity="0.8"
        className={`absolute ${
          compact ? "left-[14%] top-[54%] w-[16vw]" : "left-[46%] top-[68%] w-[7vw] max-w-[96px]"
        } will-change-transform`}
      >
        <Image
          data-orb-image
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
        data-drift-x="38"
        data-drift-y="28"
        data-period="7"
        data-phase="0.7"
        data-spin="6"
        data-pop-at="0.3"
        data-base-opacity="0.65"
        className={`absolute ${
          compact ? "right-[12%] top-[16%] w-[11vw]" : "left-[88%] top-[28%] w-[5vw] max-w-[68px]"
        } will-change-transform`}
      >
        <Image
          data-orb-image
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
