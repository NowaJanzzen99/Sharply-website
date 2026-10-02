import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealImage, RevealLines } from "./Reveal";
import { workHref, type Content, type Lang } from "@/content";

type Item = Content["work"]["items"][number];

/**
 * Real client work and concept projects side by side. Every card says which
 * it is: a client project in the accent colour, a concept in grey, so nobody
 * mistakes one for the other. Noah swaps concepts for real work one by one by
 * setting `real: true` on an item in the content files.
 */
function ProjectCard({
  item,
  label,
  clientLabel,
  variant,
  className,
  lang,
  wide = false,
  lag = 0,
}: {
  item: Item;
  label: string;
  clientLabel: string;
  variant: string;
  className: string;
  lang: Lang;
  wide?: boolean;
  lag?: number;
}) {
  return (
    <article
      data-scene="photo"
      data-scene-lag={lag}
      className={`group relative ${className}`}
    >
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
            data-scene-img
            className="object-cover"
          />
        </div>
      </RevealImage>

      <Reveal delay={0.08}>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-[22px] font-medium text-text md:text-[26px]">
              {/* Stretched over the card, so the whole thing is a target and
                  the link is still named after the project. */}
              <Link
                href={workHref(lang, item.key)}
                className="inline-flex items-start gap-2 after:absolute after:inset-0 after:content-['']"
              >
                {item.title}
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="mt-[0.35em] shrink-0 text-text-faint transition-[transform,color] duration-200 ease-[var(--ease-out)] group-hover:text-accent-bright hover-fine:group-hover:translate-x-0.5 hover-fine:group-hover:-translate-y-0.5"
                />
              </Link>
            </h3>
            <p className="mt-1 text-[15px] text-text-muted">{item.discipline}</p>
          </div>
          <span
            className={`mt-1.5 shrink-0 rounded-[var(--radius-pill)] border px-3 py-1 text-[12px] ${
              item.real ? "border-accent/60 text-accent-bright" : "border-hairline text-text-faint"
            }`}
          >
            {item.label ?? (item.real ? clientLabel : label)}
          </span>
        </div>
        <p className="mt-3 max-w-[50ch] text-[16px] leading-[1.6] text-text-muted">
          {item.blurb}
        </p>
      </Reveal>
    </article>
  );
}

export function Work({ content, lang }: { content: Content; lang: Lang }) {
  const [first, ...rest] = content.work.items;
  const label = content.work.conceptLabel;
  const clientLabel = content.work.clientLabel;

  return (
    <section id="werk" className="relative scroll-mt-24 border-t border-hairline py-24 md:py-32">
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
          <ProjectCard
            item={first}
            label={label}
            clientLabel={clientLabel}
            lang={lang}
            variant="left"
            wide
            className="md:col-span-8"
          />

          <Reveal className="md:col-span-4 md:self-end" delay={0.1}>
            <div data-scene="panel" data-scene-variant="up" data-scene-lag={0.1} className="glass rounded-[var(--radius-lg)] p-7">
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

          {/* The second project is pushed to the right, so a row of two does
              not leave a hole where a third card is not yet. From three on,
              they sit two to a row. */}
          {rest.map((item, index) => (
            <ProjectCard
              key={item.key}
              item={item}
              label={label}
              clientLabel={clientLabel}
              lang={lang}
              variant={index % 2 ? "diagonal" : "circle"}
              lag={index % 2 ? 0.12 : 0}
              className={rest.length === 1 ? "md:col-span-7 md:col-start-6" : "md:col-span-6"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
