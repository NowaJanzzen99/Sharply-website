import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealImage, RevealLines } from "./Reveal";
import type { Content } from "@/content";

type Item = Content["work"]["items"][number];

/**
 * Concept projects, made by Sharply to show how the work looks. They are
 * labelled as concepts in the interface and flagged in BRIEF.md, so nobody
 * mistakes them for client work and Noah can swap in real projects one by one.
 */
function ProjectCard({
  item,
  label,
  variant,
  className,
  wide = false,
}: {
  item: Item;
  label: string;
  variant: string;
  className: string;
  wide?: boolean;
}) {
  return (
    <article className={`group ${className}`}>
      <RevealImage
        variant={variant}
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-hairline"
      >
        <div className={`relative ${wide ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes={wide ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 55vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] hover-fine:group-hover:scale-[1.035]"
          />
        </div>
      </RevealImage>

      <Reveal delay={0.08}>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-[22px] font-medium text-text md:text-[26px]">
              {item.title}
            </h3>
            <p className="mt-1 text-[15px] text-text-muted">{item.discipline}</p>
          </div>
          <span className="mt-1.5 shrink-0 rounded-[var(--radius-pill)] border border-hairline px-3 py-1 text-[12px] text-text-faint">
            {label}
          </span>
        </div>
        <p className="mt-3 max-w-[50ch] text-[16px] leading-[1.6] text-text-muted">
          {item.blurb}
        </p>
      </Reveal>
    </article>
  );
}

export function Work({ content }: { content: Content }) {
  const [first, second, third] = content.work.items;
  const label = content.work.conceptLabel;

  return (
    <section className="relative border-t border-hairline py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-col gap-5 md:max-w-[62ch]">
          <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
            <RevealLines lines={[content.work.title]} onView />
          </h2>
          <Reveal delay={0.06}>
            <p className="text-[17px] leading-[1.6] text-text-muted md:text-[19px]">
              {content.work.lead}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[16px] leading-[1.6] text-text-faint">{content.work.body}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-12">
          <ProjectCard item={first} label={label} variant="left" className="md:col-span-7" />
          <ProjectCard
            item={second}
            label={label}
            variant="circle"
            className="md:col-span-5 md:mt-28"
          />
          <ProjectCard
            item={third}
            label={label}
            variant="diagonal"
            wide
            className="md:col-span-8"
          />

          <Reveal className="md:col-span-4 md:self-end" delay={0.1}>
            <div className="glass rounded-[var(--radius-lg)] p-7">
              <h3 className="font-display text-[24px] font-medium text-text">
                {content.work.ctaTitle}
              </h3>
              <p className="mt-3 text-[16px] leading-[1.6] text-text-muted">
                {content.work.ctaText}
              </p>
              <a
                href="#contact"
                className="group/cta mt-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-5 py-3 text-[15px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:bg-accent-bright"
              >
                {content.work.ctaButton}
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  className="transition-transform duration-200 ease-[var(--ease-out)] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
