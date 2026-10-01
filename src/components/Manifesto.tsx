"use client";

import Image from "next/image";
import { Reveal, RevealImage, RevealLines } from "./Reveal";
import type { Content } from "@/content";

/*
  The section that says who is behind the work. A face is the first thing a
  small business looks for before it hands over money, so the portrait sits
  beside the first thing said about the offer rather than at the bottom of the
  page in a section nobody reaches.

  An earlier version lit the lead sentence word by word as you scrolled. It read
  as a rendering fault rather than as craft, so the lead now arrives on the same
  line mask every other heading uses.
*/

export function Manifesto({ content }: { content: Content }) {
  return (
    <section id="studio" className="relative scroll-mt-24 py-28 md:py-40">
      <div className="container-page">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7 md:pr-8">
            <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
              <RevealLines lines={[content.manifesto.title]} onView />
            </h2>

            <p className="mt-8 font-display text-[clamp(1.35rem,3.2vw,2.1rem)] font-medium leading-[1.25] tracking-[-0.025em] text-text">
              <RevealLines
                lines={content.manifesto.lead.split(/(?<=\.)\s+/)}
                onView
              />
            </p>

            <div className="mt-8 flex flex-col gap-5 md:max-w-[58ch]">
              {content.manifesto.body.map((paragraph, index) => (
                <Reveal key={paragraph} delay={index * 0.06}>
                  <p className="text-[17px] leading-[1.6] text-text-muted">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <div data-scene="photo" data-scene-variant="right" className="md:col-span-5 md:pt-4">
            <RevealImage
              variant="up"
              className="relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/noah.webp"
                  alt={content.manifesto.imageAlt}
                  fill
                  sizes="(min-width: 768px) 38vw, 100vw"
                  data-scene-img
                  className="object-cover object-top"
                />
              </div>
            </RevealImage>
            <p className="mt-4 text-[14px] text-text-faint">{content.manifesto.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
