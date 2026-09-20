import { Reveal } from "./Reveal";
import type { Content } from "@/content";

/**
 * Placeholder section. Noah replaces the slots with real projects.
 * Nothing here pretends to be a finished case study.
 */
export function Work({ content }: { content: Content }) {
  return (
    <section className="relative border-t border-hairline py-28 md:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-5 md:max-w-[62ch]">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
              {content.work.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="text-[17px] leading-[1.6] text-text-muted md:text-[19px]">
              {content.work.lead}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[16px] leading-[1.6] text-text-faint">
              {content.work.body}
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-3">
          {content.work.slots.map((slot, index) => (
            <Reveal as="li" key={slot.title} delay={index * 0.07}>
              <div className="flex aspect-[4/5] flex-col justify-end rounded-[var(--radius-lg)] border border-dashed border-hairline-strong p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-bright">
                  {content.work.badge}
                </span>
                <span className="mt-3 block font-display text-[20px] font-medium text-text">
                  {slot.title}
                </span>
                <span className="mt-1 block text-[14px] text-text-faint">
                  {slot.discipline}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
