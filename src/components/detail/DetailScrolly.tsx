"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { DetailSection, GalleryImage } from "@/content";

/*
  The heart of a detail page, and the part that replaced four paragraphs of
  prose with something that moves.

  The stage pins for a few screens. On the left the chapters take turns: each
  title rises into place behind a mask while the one before it lifts away, one
  short line under it. On the right the picture answers the same scroll:

    image  the camera moves over the picture, zooming towards a different part
           of it for each chapter, so the picture explains the words beside it
    page   a real site, screenshotted top to bottom, scrolls inside a browser
           window as you read, stopping at the part each chapter talks about

  Everything is one continuous number, eased towards where the scroll says it
  should be, and every transform is computed from that number each frame. Same
  principle as the services reel on the homepage: scroll slowly and it moves
  slowly, stop and it holds, scroll back and it rewinds.

  Below the medium breakpoint there is no pin. The visual sits on top and
  still moves with the page (the site still scrolls inside its window), and
  the chapters follow as a plain column.
*/

export type Focus = { x: number; y: number; zoom: number };

type Visual =
  | { kind: "image"; src: string; alt: string; focus: Focus[] }
  | { kind: "page"; page: GalleryImage; url: string; urlLabel?: string; stops: number[] };

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * A value at a fractional chapter position. Each chapter holds still for a
 * stretch around its own stop, so the picture rests on what the words are
 * about, and only travels in the gap between two chapters.
 */
const HOLD = 0.22;
function at<T extends number>(stops: T[], position: number): number {
  const i = Math.floor(position);
  const t = ease(clamp((position - i - HOLD) / (1 - HOLD * 2)));
  const a = stops[Math.max(0, Math.min(stops.length - 1, i))];
  const b = stops[Math.max(0, Math.min(stops.length - 1, i + 1))];
  return lerp(a, b, t);
}

export function DetailScrolly({
  chapters,
  visual,
}: {
  chapters: DetailSection[];
  visual: Visual;
}) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const mobileArt = useRef<HTMLDivElement>(null);
  const mobileFrame = useRef<HTMLDivElement>(null);
  const count = chapters.length;

  useEffect(() => {
    const host = root.current;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const amp = reduce ? 0.5 : 1;
    const wide = window.matchMedia("(min-width: 768px)");
    const lines = Array.from(host.querySelectorAll<HTMLElement>("[data-chapter]"));

    let shown = 0;
    let running = false;
    let raf = 0;

    /** Desktop: where the pinned stage is, 0 to count - 1, with a rest at each end. */
    const measureWide = () => {
      const box = host.getBoundingClientRect();
      const travel = Math.max(box.height - window.innerHeight, 1);
      return clamp((-box.top / travel - 0.06) / 0.88) * (count - 1);
    };

    /** Phone: how far the visual has travelled across the screen, as the same scale. */
    const measureNarrow = () => {
      const el = mobileFrame.current;
      if (!el) return 0;
      const box = el.getBoundingClientRect();
      const t = clamp((window.innerHeight - box.top) / (window.innerHeight + box.height));
      return t * (count - 1);
    };

    const paintArt = (target: HTMLElement | null, position: number) => {
      if (!target) return;
      if (visual.kind === "image") {
        const x = at(visual.focus.map((f) => f.x), position);
        const y = at(visual.focus.map((f) => f.y), position);
        const z = 1 + (at(visual.focus.map((f) => f.zoom), position) - 1) * amp;
        target.style.transformOrigin = `${x.toFixed(2)}% ${y.toFixed(2)}%`;
        target.style.transform = `scale(${z.toFixed(4)})`;
      } else {
        // The page scrolls inside its window: `stops` are fractions of the
        // page, one per chapter, pointing at the part each chapter is about.
        const frac = at(visual.stops, position);
        // Layout sizes, not bounding rects: the frame is turned in perspective,
        // and a rect measured through that turn comes out a few percent too
        // big, which sends the last stops past the end of the picture.
        const room = Math.max(0, target.offsetHeight - (target.parentElement?.clientHeight ?? 0));
        target.style.transform = `translate3d(0, ${(-frac * room).toFixed(1)}px, 0)`;
      }
    };

    const render = (position: number) => {
      if (wide.matches) {
        lines.forEach((line, i) => {
          const d = position - i;
          // Gone by the time the next one arrives: two titles never share the stage.
          const out = clamp(Math.abs(d) * 2.4);
          line.style.opacity = (1 - out).toFixed(3);
          line.style.transform = `translate3d(0, ${(-d * 70 * amp).toFixed(1)}px, 0)`;
          line.style.pointerEvents = Math.abs(d) < 0.5 ? "auto" : "none";
          line.setAttribute("aria-hidden", Math.abs(d) < 0.5 ? "false" : "true");
        });

        paintArt(art.current, position);

        // The frame turns a few degrees across the section, so it has depth.
        const p = count > 1 ? position / (count - 1) : 0;
        if (frame.current) {
          frame.current.style.transform = `perspective(1600px) rotateY(${((p - 0.5) * -9 * amp).toFixed(2)}deg) rotateX(${((0.5 - p) * 4 * amp).toFixed(2)}deg)`;
        }
        if (glow.current) {
          glow.current.style.transform = `translate3d(${((p - 0.5) * 120 * amp).toFixed(1)}px, ${((0.5 - p) * 60 * amp).toFixed(1)}px, 0) scale(${(1 + Math.sin(p * Math.PI) * 0.15).toFixed(3)})`;
        }
        if (bar.current) bar.current.style.transform = `scaleX(${((position + 1) / count).toFixed(4)})`;
      } else {
        paintArt(mobileArt.current, position);
      }
    };

    const step = () => {
      const target = wide.matches ? measureWide() : measureNarrow();
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.0006) shown = target;
      render(shown);
      if (shown !== target) {
        raf = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(step);
    };

    shown = wide.matches ? measureWide() : measureNarrow();
    render(shown);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    wide.addEventListener("change", wake);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      wide.removeEventListener("change", wake);
    };
  }, [count, visual]);

  const picture = (ref: React.RefObject<HTMLDivElement | null>, sizes: string) =>
    visual.kind === "image" ? (
      <div ref={ref} className="absolute inset-0 will-change-transform">
        <Image src={visual.src} alt={visual.alt} fill sizes={sizes} className="object-cover" />
      </div>
    ) : (
      <div ref={ref} className="absolute inset-x-0 top-0 will-change-transform">
        <Image
          src={visual.page.src}
          alt={visual.page.alt}
          width={visual.page.width}
          height={visual.page.height}
          sizes={sizes}
          className="h-auto w-full"
        />
      </div>
    );

  /*
    A browser window around a real screenshot. The bar carries the real
    address and nothing else: no fake tabs, no fake buttons, nothing that
    pretends to be interface.
  */
  const chrome =
    visual.kind === "page" ? (
      <div className="flex items-center gap-3 border-b border-hairline bg-[oklch(0.16_0.028_264/0.9)] px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.4_0.03_264)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.4_0.03_264)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.4_0.03_264)]" />
        </span>
        <span className="mx-auto truncate rounded-[var(--radius-pill)] bg-canvas-deep px-4 py-1 font-mono text-[12px] text-text-faint">
          {(visual.urlLabel ?? visual.url).replace(/^https?:\/\//, "")}
        </span>
      </div>
    ) : null;

  return (
    <section className="border-t border-hairline">
      {/* Desktop: pinned. */}
      <div
        ref={root}
        className="relative hidden md:block"
        style={{ height: `${count * 95 + 40}vh` }}
      >
        <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
          <div
            ref={glow}
            aria-hidden="true"
            className="pointer-events-none absolute right-[8%] top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.5_0.16_259/0.35)_0%,oklch(0.3_0.12_265/0.12)_45%,transparent_70%)] blur-2xl will-change-transform"
          />
          <div className="container-page w-full">
            <div className="grid grid-cols-12 items-center gap-10">
              <div className="relative col-span-5 h-[46vh]">
                {chapters.map((chapter, i) => (
                  <div
                    key={chapter.title}
                    data-chapter
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
                    style={i === 0 ? undefined : { opacity: 0 }}
                  >
                    <h2 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text">
                      {chapter.title}
                    </h2>
                    <p className="mt-5 max-w-[40ch] text-[18px] leading-[1.6] text-text-muted">
                      {chapter.body}
                    </p>
                  </div>
                ))}

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 block h-px w-40 overflow-hidden bg-hairline"
                >
                  <span
                    ref={bar}
                    className="block h-full w-full origin-left bg-accent"
                    style={{ transform: `scaleX(${1 / count})` }}
                  />
                </span>
              </div>

              <div className="col-span-7">
                <div
                  ref={frame}
                  className="frame overflow-hidden rounded-[var(--radius-lg)] p-1.5 will-change-transform"
                >
                  <div className="overflow-hidden rounded-[calc(var(--radius-lg)-4px)] bg-canvas-deep">
                    {chrome}
                    <div className="relative aspect-[16/11] overflow-hidden">
                      {picture(art, "(min-width: 768px) 56vw, 100vw")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone: no pin, the visual still moves with the page. */}
      <div className="container-page py-16 md:hidden">
        <div ref={mobileFrame} className="frame overflow-hidden rounded-[var(--radius-lg)] p-1">
          <div className="overflow-hidden rounded-[calc(var(--radius-lg)-4px)] bg-canvas-deep">
            {chrome}
            <div className="relative aspect-[4/5] overflow-hidden">
              {picture(mobileArt, "100vw")}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-10">
          {chapters.map((chapter) => (
            <div key={chapter.title} data-scene="panel" data-scene-variant="up">
              <h2 className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-text">
                {chapter.title}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.6] text-text-muted">{chapter.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
