"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "./Reveal";
import Image from "next/image";
import type { Content } from "@/content";

function LitWord({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.24, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  );
}

export function Manifesto({ content }: { content: Content }) {
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 0.85", "start 0.3"],
  });

  const words = content.manifesto.lead.split(" ");

  return (
    <section id="studio" className="relative scroll-mt-24 py-28 md:py-40">
      <div className="container-page">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7 md:pr-8">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
                {content.manifesto.title}
              </h2>
            </Reveal>

            <div
              ref={section}
              className="mt-8 font-display text-[clamp(1.35rem,3.2vw,2.1rem)] font-medium leading-[1.25] tracking-[-0.025em] text-text"
            >
              {words.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <LitWord
                    word={word}
                    progress={scrollYProgress}
                    start={index / words.length}
                    end={(index + 1) / words.length}
                  />
                  {index < words.length - 1 ? " " : null}
                </span>
              ))}
            </div>

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

          <Reveal className="md:col-span-5 md:pt-16" delay={0.1}>
            <figure className="relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline">
              <Image
                src="/images/handcraft-ai.webp"
                alt={content.manifesto.imageAlt}
                width={2336}
                height={1744}
                sizes="(min-width: 768px) 42vw, 100vw"
                className="h-full w-full object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
