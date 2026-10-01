"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle, Lock } from "@phosphor-icons/react";
import type { Content } from "@/content";

/*
  The portrait as a scene: Noah in the middle, and the things he builds flying
  in around him as you scroll.

  The section is a tall track with a sticky stage inside it, so the scroll
  position becomes a timeline from 0 to 1 while the stage stays on screen.
  Every card has its own window on that timeline and its own path in:

    back cards   start small and far away and come forward out of the dark.
                 They sit between the glow and the cut-out photo, so they pass
                 behind his head and shoulders.
    front cards  start large, as if right in front of the lens, and settle
                 back into place over the photo.

  That difference in scale is what sells the depth: things behind him grow as
  they arrive, things in front of him shrink. Scroll back up and they all fly
  out again the way they came.

  The stage is laid out in a fixed design space (1440x900 on wide screens,
  390x844 on phones) and scaled to fit, so the composition is the same on every
  screen instead of reflowing into something nobody designed.

  The cards show real things only: Live Wedding Paintings (the client site),
  this site's own hero, and the kinds of interface the services describe. No
  invented brands, no invented figures.

  One rAF loop, asleep when nothing moves; transform and opacity only. With
  reduced motion they still follow the scroll, with less turn and no tilt.
*/

type Kind =
  | "browser"
  | "sharply"
  | "chat"
  | "price"
  | "phone"
  | "checkout"
  | "live"
  | "name";

type Spot = {
  kind: Kind;
  layer: "back" | "front";
  /** Centre of the card in design-space pixels. */
  x: number;
  y: number;
  scale?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  /** Order on the timeline. */
  order: number;
};

type Layout = {
  w: number;
  h: number;
  /** The photo: left, top and height in design-space pixels. */
  photo: { x: number; y: number; h: number };
  spots: Spot[];
};

const DESKTOP: Layout = {
  w: 1440,
  h: 900,
  photo: { x: 422, y: 40, h: 860 },
  spots: [
    { kind: "browser", layer: "back", x: 425, y: 270, ry: 16, rz: -2, order: 0 },
    { kind: "sharply", layer: "back", x: 1050, y: 250, ry: -16, rz: 2, order: 1 },
    { kind: "live", layer: "front", x: 1270, y: 668, rz: -3, order: 2 },
    { kind: "chat", layer: "front", x: 290, y: 560, ry: 12, rz: -2, order: 3 },
    { kind: "price", layer: "front", x: 1175, y: 545, ry: -12, rz: 2, order: 4 },
    { kind: "phone", layer: "front", x: 565, y: 705, rz: -7, order: 5 },
    { kind: "checkout", layer: "front", x: 965, y: 740, rz: 5, order: 6 },
    { kind: "name", layer: "front", x: 300, y: 790, order: 7 },
  ],
};

const MOBILE: Layout = {
  w: 390,
  h: 844,
  photo: { x: -48, y: 150, h: 700 },
  spots: [
    { kind: "browser", layer: "back", x: 118, y: 196, scale: 0.5, ry: 14, rz: -3, order: 0 },
    { kind: "sharply", layer: "back", x: 288, y: 150, scale: 0.5, ry: -14, rz: 3, order: 1 },
    { kind: "chat", layer: "front", x: 108, y: 530, scale: 0.6, ry: 10, rz: -3, order: 2 },
    { kind: "price", layer: "front", x: 290, y: 470, scale: 0.6, ry: -10, rz: 3, order: 3 },
    { kind: "phone", layer: "front", x: 64, y: 690, scale: 0.62, rz: -7, order: 4 },
    { kind: "checkout", layer: "front", x: 284, y: 690, scale: 0.6, rz: 5, order: 5 },
  ],
};

/* matchMedia as an external store: no setState inside an effect. */
const QUERY = "(max-width: 767px)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useMobile = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function StudioStage({ content }: { content: Content }) {
  const mobile = useMobile();
  const layout = mobile ? MOBILE : DESKTOP;
  const track = useRef<HTMLDivElement>(null);
  const space = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Scrubbed by the visitor's own scroll, so it stays with reduced motion,
    // as ScrollScenes does: calmer turns, no pointer tilt.
    const amp = reduce ? 0.5 : 1;
    const count = Math.max(...layout.spots.map((s) => s.order)) + 1;
    let frame = 0;
    let running = false;
    let p = 0;
    let target = 0;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;

    const fit = () => {
      const el = space.current;
      if (!el) return;
      const s = Math.min(window.innerWidth / layout.w, window.innerHeight / layout.h);
      el.style.transform = `translate(-50%, -50%) scale(${s.toFixed(4)})`;
    };

    const measure = () => {
      const el = track.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const range = box.height - window.innerHeight;
      target = clamp(-box.top / Math.max(1, range));
    };

    const render = () => {
      const cx = layout.w / 2;
      const cy = layout.h / 2;
      const span = 0.3;
      const gap = (0.86 - span - 0.04) / Math.max(1, count - 1);

      layout.spots.forEach((spot, i) => {
        const el = cards.current[i];
        if (!el) return;
        const start = 0.04 + spot.order * gap;
        const t = clamp((p - start) / span);
        const e = easeOut(t);
        const rest = 1 - e;
        const back = spot.layer === "back";

        // Out along the line from the centre of the stage, and in depth.
        const dirX = spot.x - cx;
        const dirY = spot.y - cy;
        const len = Math.hypot(dirX, dirY) || 1;
        const dist = back ? layout.w * 0.28 : layout.w * 0.62;
        const fromScale = back ? 0.45 : 1.9;
        const spin = (spot.rz ?? 0) >= 0 ? 16 : -16;

        // After landing, a slow drift that keeps the depth readable.
        const after = clamp((p - start - span) / 0.3);
        const drift = after * (back ? 14 : -26);
        const depth = back ? -0.5 : 1;

        const x = (dirX / len) * dist * rest + mx * 12 * depth;
        const y = (dirY / len) * dist * 0.75 * rest + drift + my * 8 * depth;
        const s = (spot.scale ?? 1) * (fromScale + (1 - fromScale) * e);
        const rx = (spot.rx ?? 0) + rest * (back ? -10 : 18) * amp - my * 3 * depth;
        const ry = (spot.ry ?? 0) + rest * (dirX > 0 ? -24 : 24) * amp + mx * 4 * depth;
        const rz = (spot.rz ?? 0) + rest * spin * amp;

        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${s.toFixed(4)})`;
        el.style.opacity = clamp(t * 2.4).toFixed(3);
      });

      if (photo.current) {
        const settle = easeOut(clamp(p / 0.35));
        const s = 1.08 - 0.08 * settle;
        photo.current.style.transform = `translate3d(${(mx * -6).toFixed(1)}px, ${((1 - settle) * 30).toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      }
      if (glow.current) {
        glow.current.style.opacity = (0.55 + 0.45 * easeOut(clamp(p / 0.5))).toFixed(3);
      }
    };

    const step = () => {
      p += (target - p) * 0.14;
      mx += (tmx - mx) * 0.08;
      my += (tmy - my) * 0.08;
      const moving =
        Math.abs(target - p) > 0.0004 || Math.abs(tmx - mx) > 0.002 || Math.abs(tmy - my) > 0.002;
      if (!moving) {
        p = target;
        mx = tmx;
        my = tmy;
      }
      render();
      if (moving) {
        frame = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const wake = () => {
      measure();
      if (running) return;
      running = true;
      frame = requestAnimationFrame(step);
    };

    const onPointer = (event: PointerEvent) => {
      if (reduce || event.pointerType !== "mouse") return;
      tmx = (event.clientX / window.innerWidth) * 2 - 1;
      tmy = (event.clientY / window.innerHeight) * 2 - 1;
      wake();
    };

    const onResize = () => {
      fit();
      wake();
    };

    fit();
    measure();
    p = target;
    render();

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [layout]);

  const photoW = (layout.photo.h * 1100) / 1588;
  const card = (layer: "back" | "front") =>
    layout.spots.map((spot, i) =>
      spot.layer === layer ? (
        <div
          key={`${spot.kind}-${mobile ? "m" : "d"}`}
          className="absolute"
          style={{ left: spot.x, top: spot.y }}
        >
          <div
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="will-change-transform"
            style={{ opacity: 0 }}
          >
            <StageCard kind={spot.kind} content={content} />
          </div>
        </div>
      ) : null,
    );

  return (
    <div ref={track} className="relative h-[300vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          ref={glow}
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(46%_58%_at_50%_44%,oklch(0.42_0.16_259/0.55)_0%,oklch(0.24_0.08_262/0.35)_45%,transparent_75%)]"
        />

        <div
          ref={space}
          className="absolute left-1/2 top-1/2 origin-center"
          style={{ width: layout.w, height: layout.h, perspective: 1400 }}
        >
          {card("back")}

          <div
            ref={photo}
            className="absolute will-change-transform"
            style={{
              left: layout.photo.x,
              top: layout.photo.y,
              width: photoW,
              height: layout.photo.h,
              transformOrigin: "50% 100%",
            }}
          >
            <Image
              src="/images/noah-cut.webp"
              alt={content.manifesto.imageAlt}
              fill
              sizes="(min-width: 768px) 600px, 100vw"
              className="object-contain object-top [mask-image:linear-gradient(to_bottom,#000_72%,transparent_98%)]"
            />
          </div>

          {card("front")}
        </div>

        {/* Melt the stage into the sections above and below. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent"
        />
      </div>
    </div>
  );
}

function StageCard({ kind, content }: { kind: Kind; content: Content }) {
  const copy = content.manifesto.stage;

  switch (kind) {
    case "browser":
      return (
        <div aria-hidden="true" className="ui-card w-[440px] overflow-hidden rounded-[14px]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-3 flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-text-muted">
              <Lock size={10} weight="bold" />
              liveweddingpaintings.nl
            </span>
          </div>
          <Image
            src="/images/lwp-formaten.webp"
            alt=""
            width={440}
            height={275}
            sizes="440px"
            className="block h-auto w-full"
          />
        </div>
      );

    case "sharply":
      return (
        <div aria-hidden="true" className="ui-card relative w-[380px] overflow-hidden rounded-[14px] p-6">
          <Image
            src="/images/orb-small.webp"
            alt=""
            width={190}
            height={188}
            sizes="190px"
            className="absolute -right-8 top-10 w-[190px] opacity-90"
          />
          <div className="relative flex items-center justify-between text-[11px] text-text-muted">
            <span className="font-display text-[14px] font-semibold text-text">sharply</span>
            <span className="flex gap-3">
              <span>{content.nav.links[1]?.label}</span>
              <span>{content.nav.links[4]?.label}</span>
            </span>
          </div>
          <p className="relative mt-9 max-w-[200px] font-display text-[30px] font-semibold leading-[1.02] tracking-[-0.03em] text-text">
            {content.hero.lineOne} {content.hero.lineTwo}
          </p>
          <span className="relative mt-6 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-[12px] font-medium text-accent-ink">
            {content.hero.primary}
            <ArrowRight size={12} weight="bold" />
          </span>
        </div>
      );

    case "chat":
      return (
        <div aria-hidden="true" className="ui-card w-[300px] rounded-[14px] p-4">
          <p className="flex items-center gap-2 text-[12px] font-medium text-text">
            <span className="h-2 w-2 rounded-full bg-accent-bright shadow-[0_0_10px_var(--accent)]" />
            {copy.chatTitle}
          </p>
          <p className="ml-auto mt-4 w-fit max-w-[80%] rounded-[12px] rounded-br-[4px] bg-white/[0.08] px-3 py-2 text-[12.5px] leading-[1.4] text-text">
            {copy.chatQuestion}
          </p>
          <p className="mt-2 w-fit max-w-[88%] rounded-[12px] rounded-bl-[4px] bg-accent/25 px-3 py-2 text-[12.5px] leading-[1.4] text-text">
            {copy.chatAnswer}
          </p>
          <div className="mt-4 flex items-center justify-between rounded-full border border-white/10 px-3.5 py-2 text-[11.5px] text-text-faint">
            {copy.chatInput}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-ink">
              <ArrowRight size={11} weight="bold" />
            </span>
          </div>
        </div>
      );

    case "price":
      return (
        <div aria-hidden="true" className="ui-card w-[270px] rounded-[14px] p-5">
          <p className="text-[11.5px] text-text-muted">{copy.priceTitle}</p>
          <p className="mt-2 font-display text-[24px] font-semibold tracking-[-0.02em] text-text">
            {copy.priceRange}
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="ml-[34%] h-full w-[38%] rounded-full bg-accent-bright" />
          </div>
          <p className="mt-3 text-[11.5px] text-text-faint">{copy.priceNote}</p>
        </div>
      );

    case "phone":
      return (
        <div
          aria-hidden="true"
          className="ui-card w-[150px] overflow-hidden rounded-[26px] p-[5px]"
        >
          <Image
            src="/images/lwp-mobile.webp"
            alt=""
            width={140}
            height={303}
            sizes="140px"
            className="block h-auto w-full rounded-[21px]"
          />
        </div>
      );

    case "checkout":
      return (
        <div aria-hidden="true" className="ui-card w-[260px] rounded-[14px] p-5">
          <p className="text-[13px] font-medium text-text">{copy.checkoutTitle}</p>
          <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3 text-[12px] text-text-muted">
            {copy.checkoutTotal}
            <span className="font-display text-[18px] font-semibold text-text">
              {copy.checkoutAmount}
            </span>
          </div>
          <span className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-text py-2.5 text-[12px] font-medium text-canvas-deep">
            {copy.checkoutPay}
          </span>
        </div>
      );

    case "live":
      return (
        <div
          aria-hidden="true"
          className="ui-card flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[12.5px] text-text"
        >
          <CheckCircle size={16} weight="fill" className="text-[oklch(0.78_0.17_150)]" />
          {copy.live}
        </div>
      );

    case "name":
      return (
        <div className="ui-card flex items-baseline gap-3 whitespace-nowrap rounded-full px-5 py-3">
          <span className="font-display text-[16px] font-medium text-text">
            {content.manifesto.caption.split(",")[0]}
          </span>
          <span className="text-[13px] text-text-muted">
            {copy.role}, {content.manifesto.caption.split(",")[1]?.trim()}
          </span>
        </div>
      );
  }
}
