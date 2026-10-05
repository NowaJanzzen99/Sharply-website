"use client";

import { ViewTransition, useEffect, useRef } from "react";
import Image from "next/image";

/*
  The picture at the top of a detail page.

  It opens rather than appears: the frame is narrow and letterboxed when the
  page lands, and as you scroll the first screen it widens to the full column,
  grows taller, and the picture inside settles out of its own zoom. Everything
  is scrubbed off the scroll position, so it is you opening it, not a timer.

  The width is animated with scaleX on a wrapper and the inverse scaleX on the
  content, which is the one way to widen a box without the browser laying the
  page out again on every frame. Animating the width itself, or the inset, costs
  a full layout pass per frame and is exactly the stutter this site spent a week
  getting rid of.
*/
export function DetailStage({
  src,
  alt,
  priority = false,
  name,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  /** Shared with the card that links here, so the card grows into this frame. */
  name?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    const box = outer.current;
    const counter = inner.current;
    const art = picture.current;
    if (!root || !box || !counter || !art) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const amp = reduce ? 0.55 : 1;

    let shown = 0;
    let frame = 0;
    let running = false;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      // 0 while the frame sits where it started, 1 once it has climbed a screen.
      const travelled = window.innerHeight * 0.75;
      return Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travelled - 0.1));
    };

    const render = (t: number) => {
      const e = 1 - (1 - t) ** 3;
      // From 86 per cent of the column to the whole of it.
      const squeeze = 1 - 0.14 * (1 - e) * amp;
      box.style.transform = `scaleX(${squeeze.toFixed(4)})`;
      counter.style.transform = `scaleX(${(1 / squeeze).toFixed(4)})`;
      // Letterboxed at rest, full height once open.
      box.style.setProperty("--reveal", `${(8 * (1 - e) * amp).toFixed(2)}%`);
      art.style.transform = `scale(${(1 + 0.16 * (1 - e) * amp).toFixed(4)}) translate3d(0, ${(-3 * (1 - e) * amp).toFixed(2)}%, 0)`;
    };

    const step = () => {
      const target = measure();
      shown += (target - shown) * 0.14;
      if (Math.abs(target - shown) < 0.0008) shown = target;
      render(shown);
      if (shown !== target) {
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

    shown = measure();
    render(shown);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, []);

  return (
    <div ref={host} className="container-page">
      <ViewTransition name={name} share={name ? "case-morph" : undefined} default="none">
      <div
        ref={outer}
        style={{ "--reveal": "8%" } as React.CSSProperties}
        className="relative origin-center overflow-hidden rounded-[var(--radius-lg)] border border-hairline will-change-transform [clip-path:inset(var(--reveal)_0_var(--reveal)_0_round_var(--radius-lg))]"
      >
        <div ref={inner} className="origin-center will-change-transform">
          <div className="relative aspect-[16/9] overflow-hidden">
            <div ref={picture} className="absolute inset-0 will-change-transform">
              <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                sizes="(min-width: 1360px) 1280px, 100vw"
                className="object-cover"
              />
            </div>
            {/* A breath of shadow at the foot, so the frame sits on the page. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,oklch(0.09_0.022_264/0.5),transparent)]"
            />
          </div>
        </div>
      </div>
      </ViewTransition>
    </div>
  );
}
