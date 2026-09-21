"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Reveal, RevealImage, RevealLines, RevealStagger } from "./Reveal";
import type { Content, Service } from "@/content";

/*
  Desktop turns the service list into a horizontal reel. The stage pins, and as
  you scroll down the six services travel sideways through it: the one you are
  on sits large and lit, its neighbours wait at the edge, dimmer and a little
  smaller. Scrolling stays ordinary and reversible, so the section is
  choreographed without taking the scroll away from anyone.

  The reel is scrubbed, not triggered. Two earlier versions flipped a class or
  fired a fixed-length transition when a step crossed a threshold, which reads as
  a stutter: a mouse wheel delivers scroll in notches, and every notch that
  crossed a line fired an animation. Here the scroll position becomes one
  continuous number, eased towards its target, and everything on screen is
  computed from that number every frame. Slow scroll, slow motion; fast scroll,
  fast motion; stop, and it settles.

  Mobile gets a plain stack. Its images carry loading="lazy" inside a
  display:none branch, so only the branch a visitor actually sees fetches.
*/

const STEP_VH = 80;

/*
  Each picture drifts against its frame in its own direction as the card passes
  (vx, vy in px per step), so six services read as six distinct things and not
  one template repeated. "circle" has no direction: it breathes instead.
*/
const SIGNATURE: Record<string, { variant: string; vx: number; vy: number }> = {
  websites: { variant: "left", vx: 96, vy: 0 },
  aiChat: { variant: "circle", vx: 0, vy: 0 },
  webshop: { variant: "diagonal", vx: 72, vy: 60 },
  integrations: { variant: "center", vx: 0, vy: -70 },
  branding: { variant: "right", vx: -96, vy: 0 },
  aiContent: { variant: "up", vx: 40, vy: 70 },
};

const MOBILE_VARIANTS = ["left", "circle", "diagonal", "center", "right", "up"];

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));

/**
 * One service. Its look is written by the scrub effect in Services; the card
 * itself renders once and never changes.
 */
function Card({ service }: { service: Service }) {
  const signature = SIGNATURE[service.key] ?? SIGNATURE.websites;

  return (
    <article
      data-card
      data-variant={signature.variant}
      data-vx={signature.vx}
      data-vy={signature.vy}
      className="w-[min(62vw,920px)] shrink-0 origin-left will-change-transform"
    >
      <div className="frame rounded-[var(--radius-lg)] p-2">
        <div className="relative h-[min(46vh,520px)] min-h-[260px] overflow-hidden rounded-[calc(var(--radius-lg)-6px)]">
          <Image
            data-card-img
            src={service.image}
            alt={service.alt}
            fill
            sizes="(min-width: 768px) 62vw, 100vw"
            className="object-cover will-change-transform"
          />
        </div>
      </div>

      <div className="mt-7 grid grid-cols-12 gap-x-8 gap-y-4">
        <h3
          data-card-el
          className="col-span-5 font-display text-[clamp(1.75rem,2.8vw,2.5rem)] font-medium text-text"
        >
          {service.title}
        </h3>
        <div className="col-span-7 flex flex-col">
          <p
            data-card-el
            className="max-w-[52ch] text-[16px] leading-[1.6] text-text-muted"
          >
            {service.body}
          </p>
          <ul data-card-el className="mt-4 flex flex-wrap gap-2">
            {service.points.map((point) => (
              <li
                key={point}
                className="rounded-[var(--radius-pill)] border border-hairline px-3 py-1.5 text-[13px] text-text-faint"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function Services({ content }: { content: Content }) {
  const items = content.services.items;
  const count = items.length;
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);

  /*
    The scrub. `target` is where the scroll position says the reel should be
    (0 to count - 1); `shown` chases it. Everything visible is a function of
    `shown` alone, so it can never be caught between two states.

    The loop only runs while there is something to catch up to: a scroll or a
    resize wakes it, and it stops itself once `shown` has settled.
  */
  useEffect(() => {
    const root = container.current;
    const strip = track.current;
    if (!root || !strip) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion keeps the scrub, since the visitor drives it, at half the travel.
    const amp = reduce ? 0.5 : 1;

    const cards = Array.from(strip.querySelectorAll<HTMLElement>("[data-card]")).map(
      (card) => ({
        card,
        img: card.querySelector<HTMLElement>("[data-card-img]"),
        els: Array.from(card.querySelectorAll<HTMLElement>("[data-card-el]")),
        vx: Number(card.dataset.vx ?? 0),
        vy: Number(card.dataset.vy ?? 0),
        breathe: card.dataset.variant === "circle",
      }),
    );

    // Distance from one card to the next, read from layout (offsetLeft ignores transforms).
    let stride = 0;
    const measureStride = () => {
      stride = cards.length > 1 ? cards[1].card.offsetLeft - cards[0].card.offsetLeft : 0;
    };
    measureStride();

    /** Where the scroll says the reel is: 0 at the first service, count - 1 at the last. */
    const measure = () => {
      const box = root.getBoundingClientRect();
      const travel = Math.max(box.height - window.innerHeight, 1);
      // A short hold at each end, so the first and last service can rest.
      const t = clamp((-box.top / travel - 0.05) / 0.9);
      return t * (count - 1);
    };

    const render = (position: number) => {
      strip.style.transform = `translate3d(${(-position * stride).toFixed(1)}px, 0, 0)`;

      cards.forEach((entry, i) => {
        const d = position - i;
        const near = clamp(Math.abs(d));

        entry.card.style.opacity = (1 - 0.6 * near).toFixed(3);
        entry.card.style.transform = `scale(${(1 - 0.06 * near * amp).toFixed(4)})`;

        // The picture slides against its frame: a slower layer, for depth. The
        // scale is what makes room, and the clamp keeps the edge inside it.
        if (entry.img) {
          const x = clamp(-d * entry.vx * 0.6 * amp, -80, 80);
          const y = clamp(-d * entry.vy * 0.3 * amp, -22, 22);
          const scale = entry.breathe ? 1.1 + Math.min(1.5, Math.abs(d)) * 0.08 : 1.2;
          entry.img.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        }

        // The copy trails on the way in and leads on the way out, later lines
        // a beat after the heading.
        entry.els.forEach((el, k) => {
          const shift = -d * (16 + k * 10) * amp;
          el.style.transform = `translate3d(${shift.toFixed(1)}px, 0, 0)`;
          el.style.opacity = clamp(1 - Math.abs(d) * (1.15 + k * 0.1)).toFixed(3);
        });
      });

      if (bar.current) {
        bar.current.style.transform = `scaleX(${((position + 1) / count).toFixed(4)})`;
      }
    };

    let shown = measure();
    let frame = 0;
    let running = false;
    let lastIndex = -1;

    const step = () => {
      const target = measure();
      shown += (target - shown) * 0.14;
      if (Math.abs(target - shown) < 0.0008) shown = target;

      render(shown);

      const nearest = Math.round(shown);
      if (nearest !== lastIndex) {
        lastIndex = nearest;
        setIndex(nearest);
      }

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

    const onResize = () => {
      measureStride();
      wake();
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    wake();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  /** Jump to a service. The page moves at once and the reel glides after it. */
  const jump = (position: number) => {
    const root = container.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const travel = Math.max(box.height - window.innerHeight, 1);
    const t = 0.05 + (0.9 * position) / (count - 1);
    window.scrollTo({ top: window.scrollY + box.top + travel * t, behavior: "auto" });
  };

  return (
    <section
      id="diensten"
      className="relative scroll-mt-24 border-t border-hairline pt-28 md:pt-40"
    >
      <div className="container-page">
        <div className="max-w-[52ch]">
          <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
            <RevealLines lines={[content.services.title]} onView />
          </h2>
          <Reveal delay={0.06}>
            <p className="mt-5 text-[17px] leading-[1.6] text-text-muted md:text-[19px]">
              {content.services.lead}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Desktop reel */}
      <div
        ref={container}
        className="relative hidden md:block"
        style={{ height: `${count * STEP_VH}vh` }}
      >
        <div className="sticky top-0 flex h-[100dvh] flex-col justify-center gap-9 overflow-hidden">
          <div
            ref={track}
            className="flex gap-10 will-change-transform"
            style={{ paddingLeft: "max(2.5rem, calc((100vw - 1360px) / 2 + 2.5rem))" }}
          >
            {items.map((service) => (
              <Card key={service.key} service={service} />
            ))}
          </div>

          {/* Navigation: the six services, and how far through them you are. */}
          <nav aria-label={content.services.title} className="container-page w-full">
            <ol className="flex flex-wrap gap-x-7 gap-y-1">
              {items.map((service, i) => (
                <li key={service.key}>
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    aria-current={i === index ? "true" : undefined}
                    className="py-1.5 text-[15px] transition-colors duration-200 ease-[var(--ease-out)] hover-fine:hover:text-text"
                    style={{ color: i === index ? "var(--text)" : "var(--text-faint)" }}
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ol>
            <span
              aria-hidden="true"
              className="mt-3 block h-px w-full overflow-hidden bg-hairline"
            >
              <span
                ref={bar}
                className="block h-full w-full origin-left bg-accent"
                style={{ transform: `scaleX(${1 / count})` }}
              />
            </span>
          </nav>
        </div>
      </div>

      {/* Mobile stack */}
      <div className="container-page md:hidden">
        <div className="mt-14 flex flex-col gap-14 pb-28">
          {items.map((service, position) => (
            <article key={service.key} data-scene>
              <RevealImage
                variant={MOBILE_VARIANTS[position % MOBILE_VARIANTS.length]}
                className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-hairline"
              >
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </RevealImage>
              <h3 className="mt-6 font-display text-[22px] font-medium text-text">
                {service.title}
              </h3>
              <p className="mt-3 text-[16px] leading-[1.6] text-text-muted">
                {service.body}
              </p>
              <RevealStagger className="mt-5 flex flex-wrap gap-2">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-[var(--radius-pill)] border border-hairline px-3 py-1.5 text-[13px] text-text-faint"
                  >
                    {point}
                  </li>
                ))}
              </RevealStagger>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
