"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/*
  The hero bubble.

  It is the generated still, kept exactly as it looks, and moved by hand rather
  than rebuilt in WebGL. That was the lesson from the first attempt: a shader
  bubble never matched the render, and swapping the still for it mid-load made
  the hero visibly flatten. One image, always the same image, that drifts,
  leans towards the cursor, and bursts as the page scrolls past it.

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

/*
  The burst.

  A soap bubble does not fade. A hole opens at one weak point, and the film
  around it retracts outwards at speed, tearing into curved slivers that break
  up into a ring of droplets. It is over in a few milliseconds. On screen that
  same shape reads best at about four hundred.

  So the bubble is cut into wedges. Each wedge is an empty span that borrows
  the bubble's own picture as its background and is clipped to its slice, which
  means the wedges laid on top of each other are pixel for pixel the bubble
  itself: the swap from whole to shattered is invisible. Then each one flies
  out along its own bearing, spins, shrinks and thins away. The wedge nearest
  the rupture leaves first and the tear races around the sphere from there.

  The clip paths are static. Only transform and opacity change per frame, so
  the whole burst stays on the graphics card.
*/

/** A pie slice of the bubble, with a hair of overlap so no seam shows. */
function wedgeClip(index: number, count: number) {
  const step = (Math.PI * 2) / count;
  const from = index * step - Math.PI / 2 - 0.008;
  const to = from + step + 0.016;
  const points = ["50% 50%"];
  for (let k = 0; k <= 4; k += 1) {
    const angle = from + ((to - from) * k) / 4;
    points.push(
      `${(50 + 78 * Math.cos(angle)).toFixed(2)}% ${(50 + 78 * Math.sin(angle)).toFixed(2)}%`,
    );
  }
  return `polygon(${points.join(",")})`;
}

function Shards({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          data-shard
          data-index={index}
          data-count={count}
          style={{
            clipPath: wedgeClip(index, count),
            backgroundSize: "100% 100%",
            visibility: "hidden",
          }}
          className="absolute inset-0"
        />
      ))}
    </>
  );
}

/** How long the burst takes, and how long the bubble needs to re-form. */
const POP_MS = 440;
const REFORM_MS = 900;

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
      Each bubble bursts on how far the page itself has scrolled, in pixels,
      not on where the bubble happens to sit on screen: data-pop-at is that
      distance. An earlier version measured the bubble's own position instead,
      and on a phone that bubble starts close to the top edge already, so a
      quick flick carried it, mid-burst, straight past the reach of a glance:
      it had happened, but nobody was still looking at that part of the screen
      by the time it was done. Tying it to scroll distance instead means it
      always fires within the very first, unhurried moment of scrolling,
      whatever the device and whatever the bubble's own drift is doing. The
      small ones name a smaller distance, so they go first and the big one
      last. Scrolling back up re-forms them.
    */
    type Pop = {
      at: number;
      /** 0 whole, 1 fully burst. Runs fast towards a burst, slowly back. */
      value: number;
      base: number;
      image: HTMLElement | null;
      shards: HTMLElement[];
      /** Where the film tears first, in radians. */
      rupture: number;
      /** Half the bubble's own width, which sets how far its pieces travel. */
      radius: number;
    };

    let lastTick = performance.now();
    const pops = new Map<HTMLElement, Pop>();

    layers.forEach(({ el }, order) => {
      if (el.dataset.popAt === undefined) return;
      pops.set(el, {
        at: Number(el.dataset.popAt),
        value: 0,
        base: Number(el.dataset.baseOpacity ?? 1),
        image: el.querySelector<HTMLElement>("[data-orb-image]"),
        shards: Array.from(el.querySelectorAll<HTMLElement>("[data-shard]")),
        rupture: -Math.PI / 2 + order * 1.7,
        radius: el.offsetWidth / 2,
      });
    });

    /*
      The wedges borrow the picture the browser already downloaded, read off the
      rendered element rather than written as a path. next/image serves a sized
      and re-encoded file, so hardcoding /images/orb.webp here would fetch the
      full two megapixel original a second time.
    */
    const dressShards = () => {
      pops.forEach((pop) => {
        const img = pop.image as HTMLImageElement | null;
        const src = img?.currentSrc || img?.src;
        if (!src) return;
        pop.shards.forEach((shard) => {
          if (shard.style.backgroundImage) return;
          shard.style.backgroundImage = `url("${src}")`;
          shard.style.filter = getComputedStyle(img as Element).filter;
        });
      });
    };

    dressShards();
    window.addEventListener("load", dressShards);

    const mainLayer = root.querySelector<HTMLElement>("[data-orb-main]");
    const rings = Array.from(root.querySelectorAll<HTMLElement>("[data-pop-ring]"));
    const flash = root.querySelector<HTMLElement>("[data-pop-flash]");
    const drops = Array.from(root.querySelectorAll<HTMLElement>("[data-pop-drop]"));
    const measure = () => {
      pops.forEach((pop, element) => {
        pop.radius = element.offsetWidth / 2;
      });
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

      const scrollY = window.scrollY;

      pops.forEach((pop, element) => {
        const popping = scrollY > pop.at;

        pop.value = popping
          ? Math.min(1, pop.value + dt / POP_MS)
          : Math.max(0, pop.value - dt / REFORM_MS);
        const p = pop.value;
        const burst = p > 0.0015;

        if (pop.image) {
          // Whole or shattered, never both: the wedges are the same pixels.
          pop.image.style.opacity = burst ? "0" : String(pop.base);
        }

        pop.shards.forEach((shard, index) => {
          if (!burst) {
            if (shard.style.visibility !== "hidden") shard.style.visibility = "hidden";
            return;
          }
          if (shard.style.visibility === "hidden") shard.style.visibility = "visible";

          const count = pop.shards.length;
          const bearing = ((index + 0.5) / count) * Math.PI * 2 - Math.PI / 2;
          // How far around the sphere the tear has to travel to reach this
          // wedge: the far side goes a beat after the rupture.
          let away = Math.abs(bearing - pop.rupture) % (Math.PI * 2);
          if (away > Math.PI) away = Math.PI * 2 - away;
          const start = (away / Math.PI) * 0.16;
          const t = Math.min(1, Math.max(0, (p - start) / (1 - start)));

          if (t <= 0) {
            shard.style.opacity = String(pop.base);
            shard.style.transform = "";
            return;
          }

          // Fast off the mark, slowing as the film runs out of tension.
          const out = 1 - (1 - t) ** 2.4;
          const spread = pop.radius * (1.15 + (index % 3) * 0.22) * out;
          const lift = out * out * pop.radius * 0.22;
          const spin = ((index % 2 ? 1 : -1) * 70 + (index % 5) * 12) * out;

          shard.style.opacity = (pop.base * Math.max(0, 1 - t ** 1.5)).toFixed(3);
          shard.style.transform = `translate3d(${(Math.cos(bearing) * spread).toFixed(1)}px, ${(Math.sin(bearing) * spread + lift).toFixed(1)}px, 0) rotate(${spin.toFixed(1)}deg) scale(${(1 - out * 0.62).toFixed(3)})`;
        });

        if (element === mainLayer) {
          const out = 1 - (1 - p) ** 2.4;
          const life = Math.max(0, 1 - p ** 1.5);
          const lit = burst ? 1 : 0;

          // The rim of the hole, racing outwards and gone.
          rings.forEach((ring, index) => {
            const t = Math.min(1, p * (index === 0 ? 1.9 : 1.3));
            ring.style.opacity = (lit * (1 - t) * (index === 0 ? 0.8 : 0.45)).toFixed(3);
            ring.style.transform = `scale(${(0.72 + t * (index === 0 ? 0.85 : 1.3)).toFixed(3)})`;
          });

          // One short flare as the film gives way.
          if (flash) {
            flash.style.opacity = (lit * Math.max(0, 1 - p * 9) * 0.6).toFixed(3);
            flash.style.transform = `scale(${(0.72 + out * 0.6).toFixed(3)})`;
          }

          // The spray the retracting film breaks up into, falling as it goes.
          drops.forEach((drop, index) => {
            const angle = (index / drops.length) * Math.PI * 2 + (index % 3) * 0.3;
            const reach = pop.radius * (0.8 + (index % 5) * 0.2) * out;
            const fall = out * out * pop.radius * 0.42;
            const size = 0.4 + (index % 4) * 0.25;
            drop.style.opacity = (lit * life * 0.9).toFixed(3);
            drop.style.transform = `translate3d(${(Math.cos(angle) * reach).toFixed(1)}px, ${(Math.sin(angle) * reach + fall).toFixed(1)}px, 0) scale(${(size * (1 - p * 0.45)).toFixed(3)})`;
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
      window.removeEventListener("load", dressShards);
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

      {/* The bubble itself. It bursts within the first breath of any scroll. */}
      <div
        data-orb-layer
        data-orb-main
        data-pull="1"
        data-drift-x="44"
        data-drift-y="60"
        data-period="9"
        data-spin="3"
        data-pop-at="70"
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

        <Shards count={16} />

        {/* The flare, the rim of the hole, and the spray it breaks up into. */}
        <span
          aria-hidden="true"
          data-pop-flash
          className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,oklch(0.95_0.05_240/0.75)_0%,oklch(0.7_0.14_259/0.28)_45%,transparent_70%)] opacity-0 will-change-transform"
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
        {Array.from({ length: 26 }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            data-pop-drop
            className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-[radial-gradient(circle_at_32%_30%,white_0%,oklch(0.86_0.09_230)_45%,oklch(0.6_0.16_270/0.6)_100%)] opacity-0 will-change-transform"
          />
        ))}
      </div>

      {/* Two companions, drifting on their own clocks. They go first. */}
      <div
        data-orb-layer
        data-pull="1.9"
        data-drift-x="46"
        data-drift-y="56"
        data-period="6.5"
        data-phase="0.35"
        data-spin="6"
        data-pop-at="30"
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
        <Shards count={10} />
      </div>

      <div
        data-orb-layer
        data-pull="2.6"
        data-drift-x="52"
        data-drift-y="40"
        data-period="5.5"
        data-phase="0.7"
        data-spin="8"
        data-pop-at="48"
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
        <Shards count={10} />
      </div>
    </div>
  );
}
