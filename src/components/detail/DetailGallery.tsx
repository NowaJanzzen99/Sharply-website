"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { RevealLines } from "../Reveal";
import type { GalleryImage } from "@/content";

/*
  Up close: the real screens of a real case, travelling sideways as you
  scroll down. The strip pins and slides, each picture drifts a little against
  its own frame, and the one nearest the middle sits a touch larger and
  brighter. Only on real work, because only real work has more than one
  picture worth showing.

  On a phone the strip becomes a column, and each picture enters on its own.
*/
export function DetailGallery({ title, images }: { title: string; images: GalleryImage[] }) {
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    const track = strip.current;
    if (!host || !track) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const amp = reduce ? 0.5 : 1;
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-shot]"));
    let shown = 0;
    let running = false;
    let raf = 0;

    const measure = () => {
      const box = host.getBoundingClientRect();
      const travel = Math.max(box.height - window.innerHeight, 1);
      return Math.min(1, Math.max(0, -box.top / travel));
    };

    const render = (t: number) => {
      const distance = Math.max(0, track.scrollWidth - window.innerWidth + 80);
      track.style.transform = `translate3d(${(-t * distance).toFixed(1)}px, 0, 0)`;
      const mid = window.innerWidth / 2;
      cards.forEach((card) => {
        const box = card.getBoundingClientRect();
        const off = (box.left + box.width / 2 - mid) / window.innerWidth;
        const near = Math.min(1, Math.abs(off) * 1.6);
        card.style.opacity = (1 - near * 0.45).toFixed(3);
        const img = card.querySelector<HTMLElement>("[data-shot-img]");
        if (img) img.style.transform = `translate3d(${(off * -60 * amp).toFixed(1)}px, 0, 0) scale(1.12)`;
        card.style.transform = `scale(${(1 - near * 0.07 * amp).toFixed(4)})`;
      });
    };

    const step = () => {
      const target = measure();
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      render(shown);
      if (shown !== target) raf = requestAnimationFrame(step);
      else running = false;
    };
    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(step);
    };

    shown = measure();
    render(shown);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
    };
  }, []);

  return (
    <section className="border-t border-hairline pt-20 md:pt-28">
      <div className="container-page">
        <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold text-text">
          <RevealLines lines={[title]} onView />
        </h2>
      </div>

      {/* Desktop: a pinned strip. */}
      <div ref={root} className="relative hidden md:block" style={{ height: `${images.length * 55 + 60}vh` }}>
        <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
          <div
            ref={strip}
            className="flex items-center gap-10 will-change-transform"
            style={{ paddingLeft: "max(2.5rem, calc((100vw - 1360px) / 2 + 2.5rem))" }}
          >
            {images.map((image) => (
              <figure
                key={image.src}
                data-shot
                className="frame shrink-0 overflow-hidden rounded-[var(--radius-lg)] p-1.5 will-change-transform"
                style={{ width: `min(${image.width >= image.height ? 62 : 34}vw, 980px)` }}
              >
                <div
                  className="relative overflow-hidden rounded-[calc(var(--radius-lg)-4px)]"
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                >
                  <div data-shot-img className="absolute inset-0 will-change-transform">
                    <Image src={image.src} alt={image.alt} fill sizes="62vw" className="object-cover" />
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* Phone: a column. */}
      <div className="container-page flex flex-col gap-8 pb-20 pt-10 md:hidden">
        {images.map((image, i) => (
          <figure
            key={image.src}
            data-scene="photo"
            data-scene-variant={i % 2 ? "right" : "left"}
            className="overflow-hidden rounded-[var(--radius-lg)] border border-hairline"
          >
            <div className="relative" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
              <Image src={image.src} alt={image.alt} fill sizes="100vw" data-scene-img className="object-cover" />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
