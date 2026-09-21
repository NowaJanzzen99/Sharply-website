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
    type Pop = {
      at: number;
      /** 0 whole, 1 fully burst. Moves fast towards a pop, slowly back. */
      value: number;
      /** Opacity of the skin: falls with the burst, returns on its own. */
      alpha: number;
      base: number;
      image: HTMLElement | null;
    };
    const POP_MS = 420;
    const REFORM_MS = 1100;
    let lastTick = performance.now();
    const pops = new Map<HTMLElement, Pop>();
    layers.forEach(({ el }) => {
      if (el.dataset.popAt === undefined) return;
      pops.set(el, {
        at: Number(el.dataset.popAt),
        value: 0,
        alpha: 1,
        base: Number(el.dataset.baseOpacity ?? 1),
        image: el.querySelector<HTMLElement>("[data-orb-image]"),
      });
    });

    const mainLayer = root.querySelector<HTMLElement>("[data-orb-main]");
    const rings = Array.from(root.querySelectorAll<HTMLElement>("[data-pop-ring]"));
    const flash = root.querySelector<HTMLElement>("[data-pop-flash]");
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
      const follow = fine ? 0.06 : 0.07;
      eased.x += (aimX - eased.x) * follow;
      eased.y += (aimY - eased.y) * follow;
      readScroll();

      layers.forEach((layer) => {
        const wave = (seconds / (layer.period * slow) + layer.phase) * Math.PI * 2;
        // A second, slower wave on top, so the path is a loop and never a line.
        const x =
          (Math.sin(wave) + Math.sin(wave * 0.37 + 1.3) * 0.45) * layer.driftX * calm +
          eased.x * (fine ? 96 : 46) * layer.pull * gentle;
        const y =
          (Math.cos(wave * 0.8) + Math.cos(wave * 0.29) * 0.4) * layer.driftY * calm +
          eased.y * (fine ? 68 : 34) * layer.pull * gentle +
          // The bubble trails the page a little, so it stays in view longer.
          scroll * 190 * layer.pull * gentle;
        const rotate = !reduce && layer.spin ? Math.sin(wave * 0.5) * layer.spin : 0;
        const scale = reduce
          ? 1
          : 1 + Math.sin(wave * 0.6) * 0.012 - scroll * 0.05 * layer.pull;

        layer.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      });

      const dt = Math.min(64, now - lastTick);
      lastTick = now;

      pops.forEach((pop, element) => {
        // Bursts once only `pop.at` of the bubble is still on screen, however
        // it got there (page scroll, drift or the trail): about half, so it goes
        // while it is still clearly a bubble and never slips out of view whole.
        const box = element.getBoundingClientRect();
        const left = Math.max(0, box.bottom) / Math.max(box.height, 1);
        const popping = left < pop.at;

        // A soap bubble bursts in a blink and takes a moment to come back.
        pop.value = popping
          ? Math.min(1, pop.value + dt / POP_MS)
          : Math.max(0, pop.value - dt / REFORM_MS);
        const p = pop.value;

        // Swell for the first sixth, then the skin is simply gone.
        const swell = Math.min(1, p / 0.16);
        const gone = Math.min(1, Math.max(0, (p - 0.16) / 0.07));
        if (popping) pop.alpha = Math.min(pop.alpha, 1 - gone);
        else pop.alpha += (1 - pop.alpha) * 0.07;

        if (pop.image) {
          pop.image.style.opacity = (pop.base * pop.alpha).toFixed(3);
          pop.image.style.transform = reduce
            ? ""
            : `scale(${(1 + swell * 0.05 + (1 - (1 - p) ** 3) * 0.1).toFixed(3)})`;
        }

        if (element === mainLayer && !reduce) {
          // Everything the burst throws is fast at first and slows to nothing.
          const out = 1 - (1 - p) ** 3;
          const life = Math.max(0, 1 - p ** 1.6);
          const fired = p > 0.14 ? 1 : 0;

          rings.forEach((ring, index) => {
            const start = 0.14 + index * 0.05;
            const t = Math.min(1, Math.max(0, (p - start) / (1 - start)));
            const spread = 1 - (1 - t) ** 3;
            ring.style.opacity = (fired * (1 - t) * (index === 0 ? 0.7 : 0.4)).toFixed(3);
            ring.style.transform = `scale(${(0.9 + spread * (index === 0 ? 0.75 : 1.15)).toFixed(3)})`;
          });

          if (flash) {
            flash.style.opacity = (fired * Math.max(0, 1 - (p - 0.14) * 5) * 0.55).toFixed(3);
            flash.style.transform = `scale(${(0.7 + out * 0.7).toFixed(3)})`;
          }

          drops.forEach((drop, index) => {
            const angle = (index / drops.length) * Math.PI * 2 + (index % 2) * 0.35;
            const reach = radius * (0.7 + (index % 4) * 0.22) * out;
            // A little gravity, so the spray falls the way real droplets do.
            const fall = out * out * radius * 0.35;
            const size = 0.55 + (index % 3) * 0.3;
            drop.style.opacity = (fired * life * 0.9).toFixed(3);
            drop.style.transform = `translate3d(${(Math.cos(angle) * reach).toFixed(1)}px, ${(Math.sin(angle) * reach + fall).toFixed(1)}px, 0) scale(${(size * (1 - p * 0.5)).toFixed(3)})`;
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
        data-drift-x="44"
        data-drift-y="60"
        data-period="9"
        data-spin="3"
        data-pop-at="0.5"
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
          data-pop-flash
          className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,oklch(0.92_0.06_240/0.7)_0%,oklch(0.7_0.14_259/0.25)_45%,transparent_70%)] opacity-0 will-change-transform"
        />
        <span
          aria-hidden="true"
          data-pop-ring
          className="absolute inset-[3%] rounded-full border border-[oklch(0.86_0.09_230/0.8)] opacity-0 will-change-transform"
        />
        <span
          aria-hidden="true"
          data-pop-ring
          className="absolute inset-[3%] rounded-full border border-[oklch(0.8_0.12_300/0.6)] opacity-0 will-change-transform"
        />
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            data-pop-drop
            className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-[radial-gradient(circle_at_32%_30%,white_0%,oklch(0.86_0.09_230)_45%,oklch(0.6_0.16_270/0.6)_100%)] opacity-0 will-change-transform"
          />
        ))}
      </div>

      {/* Two companions, drifting on their own clocks. */}
      <div
        data-orb-layer
        data-pull="1.9"
        data-drift-x="46"
        data-drift-y="56"
        data-period="6.5"
        data-phase="0.35"
        data-spin="6"
        data-pop-at="0.55"
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
        data-drift-x="52"
        data-drift-y="40"
        data-period="5.5"
        data-phase="0.7"
        data-spin="8"
        data-pop-at="0.6"
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
