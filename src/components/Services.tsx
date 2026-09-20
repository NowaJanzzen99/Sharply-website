import { Reveal } from "./Reveal";
import Image from "next/image";
import type { Content } from "@/content";

/**
 * Deliberately not a row of identical cards: the grid carries its own
 * rhythm (7/5, 5/7, 6/6) so the eye keeps moving down the section.
 * Every service gets a cell, no cell is left empty.
 */
const SPANS = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
  "md:col-span-6",
  "md:col-span-6",
];

const RATIOS = [
  "aspect-[16/10]",
  "aspect-[4/3]",
  "aspect-[4/3]",
  "aspect-[16/10]",
  "aspect-[3/2]",
  "aspect-[3/2]",
];

export function Services({ content }: { content: Content }) {
  return (
    <section
      id="diensten"
      className="relative scroll-mt-24 border-t border-hairline py-28 md:py-40"
    >
      <div className="container-page">
        <div className="max-w-[52ch]">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
              {content.services.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-5 text-[17px] leading-[1.6] text-text-muted md:text-[19px]">
              {content.services.lead}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-12">
          {content.services.items.map((service, index) => (
            <Reveal
              key={service.key}
              className={`${SPANS[index]} group`}
              delay={(index % 2) * 0.08}
            >
              <article className="flex h-full flex-col">
                <div
                  className={`relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline ${RATIOS[index]}`}
                >
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(min-width: 768px) 55vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out)] hover-fine:group-hover:scale-[1.04]"
                  />
                </div>

                <h3 className="mt-6 font-display text-[22px] font-medium text-text md:text-[26px]">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[16px] leading-[1.6] text-text-muted">
                  {service.body}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-[var(--radius-pill)] border border-hairline px-3 py-1.5 text-[13px] text-text-faint"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
