"use client";

import { useStepIndex } from "@/lib/use-track-progress";
import { Reveal, RevealLines } from "./Reveal";
import type { Content } from "@/content";

/*
  The four phases are a real sequence, so the section shows progress: a rail
  draws itself as you move through it and the phase you are level with comes
  forward. Purpose is state indication, not decoration, which is what earns a
  scroll-linked animation here.
*/

export function Process({ content }: { content: Content }) {
  const steps = content.process.steps;
  const { container, index: active } = useStepIndex<HTMLOListElement>(steps.length);

  return (
    <section
      id="werkwijze"
      className="relative scroll-mt-24 border-t border-hairline py-28 md:py-40"
    >
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
                <RevealLines lines={[content.process.title]} onView />
              </h2>
              <Reveal delay={0.06}>
                <p className="mt-5 max-w-[38ch] text-[17px] leading-[1.6] text-text-muted">
                  {content.process.lead}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="relative md:col-span-8 md:pl-10">
            {/* The rail, drawn from the top as the section is read. */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-hairline md:block"
            >
              <span
                className="block h-full w-full origin-top bg-accent transition-transform duration-500 ease-[var(--ease-out)]"
                style={{ transform: `scaleY(${(active + 1) / steps.length})` }}
              />
            </div>

            <ol ref={container}>
              {steps.map((step, index) => (
                <li key={step.title} data-step={index} data-scene="row" data-scene-lag={index * 0.05}>
                  <div
                    className={`relative border-b border-hairline pb-8 ${
                      index === 0 ? "pt-0" : "pt-8"
                    }`}
                    style={{
                      opacity: index <= active ? 1 : 0.42,
                      transition: "opacity 450ms var(--ease-out)",
                    }}
                  >
                    <h3
                      className="font-display text-[24px] font-medium text-text md:text-[30px]"
                      style={{
                        transform:
                          index === active ? "translateX(8px)" : "translateX(0px)",
                        transition: "transform 450ms var(--ease-out)",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.6] text-text-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
