"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useStepIndex } from "@/lib/use-track-progress";
import { Reveal, RevealImage, RevealLines, RevealStagger } from "./Reveal";
import type { Content, Service } from "@/content";

/*
  Desktop turns the service list into a reel: the stage pins for the length of
  the section while the six services advance through it, one at a time, with the
  index on the left tracking along. Scrolling stays ordinary and reversible, so
  the section is choreographed without taking the scroll away from anyone.

  Mobile gets a plain stack. Its images carry loading="lazy" inside a
  display:none branch, so only the branch a visitor actually sees fetches.
*/

const STEP_VH = 68;

/*
  Each service arrives its own way: a different shape opens the image and its
  copy travels in from a different side. Six identical crossfades read as a
  template; six distinct entrances read as six distinct things.
*/
const SIGNATURE: Record<
  string,
  { variant: string; dx: string; dy: string }
> = {
  websites: { variant: "left", dx: "-32px", dy: "0px" },
  aiChat: { variant: "circle", dx: "0px", dy: "26px" },
  webshop: { variant: "diagonal", dx: "32px", dy: "0px" },
  integrations: { variant: "center", dx: "0px", dy: "-22px" },
  branding: { variant: "right", dx: "-22px", dy: "22px" },
  aiContent: { variant: "up", dx: "22px", dy: "22px" },
};

const MOBILE_VARIANTS = ["left", "circle", "diagonal", "center", "right", "up"];

/**
 * Every stage stays mounted; only the attribute changes. Stylesheet transitions
 * then stagger the copy and wipe the image open, without an image ever being
 * torn down and fetched again mid-scroll.
 */
function Stage({ service, active }: { service: Service; active: boolean }) {
  const signature = SIGNATURE[service.key] ?? SIGNATURE.websites;

  return (
    <div
      data-stage={active ? "on" : "off"}
      aria-hidden={!active}
      style={{ "--dx": signature.dx, "--dy": signature.dy } as React.CSSProperties}
      className="absolute inset-0 grid grid-cols-12 items-center gap-10"
    >
      <div className="col-span-5 flex flex-col">
        <h3
          data-stage-el
          className="font-display text-[clamp(1.75rem,3vw,2.6rem)] font-medium text-text"
        >
          {service.title}
        </h3>
        <p
          data-stage-el
          style={{ transitionDelay: "90ms" }}
          className="mt-4 max-w-[46ch] text-[17px] leading-[1.6] text-text-muted"
        >
          {service.body}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {service.points.map((point, i) => (
            <li
              key={point}
              data-stage-el
              style={{ transitionDelay: `${180 + i * 70}ms` }}
              className="rounded-[var(--radius-pill)] border border-hairline px-3 py-1.5 text-[13px] text-text-faint"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-7">
        {/* The glass frame is always there; the picture opens inside it. */}
        <div data-tilt className="frame rounded-[var(--radius-lg)] p-2">
          <div
            data-stage-img
            data-variant={signature.variant}
            className="relative aspect-[16/11] overflow-hidden rounded-[calc(var(--radius-lg)-6px)]"
          >
            <Image
              src={service.image}
              alt={service.alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Services({ content }: { content: Content }) {
  const items = content.services.items;
  const { container, index } = useStepIndex<HTMLDivElement>(items.length);
  const stageHost = useRef<HTMLDivElement>(null);

  /*
    The active image frame leans towards the cursor. Decorative, on a page seen
    once, and gated to real pointers with motion allowed. Written straight to
    the element inside one rAF loop so it never touches React state.
  */
  useEffect(() => {
    const host = stageHost.current;
    if (!host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const tick = () => {
      x += (targetX - x) * 0.1;
      y += (targetY - y) * 0.1;

      host.querySelectorAll<HTMLElement>("[data-tilt]").forEach((element) => {
        const on = element.closest("[data-stage]")?.getAttribute("data-stage") === "on";
        element.style.transform = on
          ? `perspective(1100px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg)`
          : "";
      });

      if (Math.abs(targetX - x) > 0.002 || Math.abs(targetY - y) > 0.002) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const box = host.getBoundingClientRect();
      targetX = ((event.clientX - box.left) / box.width - 0.5) * 2;
      targetY = ((event.clientY - box.top) / box.height - 0.5) * 2;
      start();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

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
        style={{ height: `${items.length * STEP_VH}vh` }}
      >
        {/* One sentinel per service, each a step tall. The reel advances when
            the sentinel crosses the middle of the screen. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {items.map((service, i) => (
            <div key={service.key} data-step={i} style={{ height: `${STEP_VH}vh` }} />
          ))}
        </div>

        <div className="sticky top-0 flex h-[100dvh] items-center">
          <div className="container-page w-full">
            <div className="grid grid-cols-12 gap-10">
              {/* Index */}
              <ol className="col-span-3 flex flex-col gap-1 border-l border-hairline pl-6">
                {items.map((service, i) => (
                  <li key={service.key}>
                    <span
                      className="block py-1.5 text-[15px] transition-[color,transform] duration-300 ease-[var(--ease-out)]"
                      style={{
                        color: i === index ? "var(--text)" : "var(--text-faint)",
                        transform: i === index ? "translateX(6px)" : "translateX(0)",
                      }}
                    >
                      {service.title}
                    </span>
                  </li>
                ))}
                <li aria-hidden="true" className="mt-5">
                  <span className="block h-[2px] w-24 overflow-hidden rounded-[var(--radius-pill)] bg-hairline-strong">
                    <motion.span
                      className="block h-full w-full origin-left bg-accent"
                      animate={{ transform: `scaleX(${(index + 1) / items.length})` }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </span>
                </li>
              </ol>

              {/* Stage */}
              <div ref={stageHost} className="relative col-span-9 min-h-[54vh]">
                {items.map((service, i) => (
                  <Stage key={service.key} service={service} active={i === index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile stack */}
      <div className="container-page md:hidden">
        <div className="mt-14 flex flex-col gap-14 pb-28">
          {items.map((service, position) => (
            <article key={service.key}>
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
