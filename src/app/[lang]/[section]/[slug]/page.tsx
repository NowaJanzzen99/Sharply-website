import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealImage, RevealLines } from "@/components/Reveal";
import { DetailQuestions } from "@/components/detail/DetailQuestions";
import {
  getContent,
  getDetails,
  isLang,
  LANGS,
  sectionKind,
  sectionPath,
  serviceHref,
  serviceKeyFromSlug,
  workHref,
  workKeyFromSlug,
  type Content,
  type Details,
  type Lang,
  type ServiceDetail,
  type ServiceKey,
  type WorkDetail,
} from "@/content";

/*
  One route for every detail page, in both languages.

  The path segments are translated (/nl/diensten/webshops against
  /en/services/webshops), which would normally mean four route folders and four
  near-identical files. A single [section]/[slug] pair with the segment
  validated against the dictionary keeps it to one, and makes adding a third
  language a matter of writing copy rather than moving folders.

  Everything is static: generateStaticParams lists all of it at build time, so
  these pages are files on a CDN and not a server doing work per visitor.
*/

type Params = { lang: string; section: string; slug: string };

export function generateStaticParams() {
  return LANGS.flatMap((lang) => {
    const details = getDetails(lang);
    const services = Object.values(details.services).map((detail) => ({
      lang,
      section: sectionPath(lang, "services"),
      slug: detail.slug,
    }));
    const work = Object.values(details.work).map((detail) => ({
      lang,
      section: sectionPath(lang, "work"),
      slug: detail.slug,
    }));
    return [...services, ...work];
  });
}

/*
  Everything the page needs, or null when the address points at nothing.

  A discriminated union rather than one loose shape with optional fields: the
  service branch really does carry different things than the project branch
  (questions against a concept note), and a union is what lets the page read
  one or the other without a cast.
*/
type Resolved =
  | {
      kind: "services";
      lang: Lang;
      content: Content;
      details: Details;
      key: ServiceKey;
      title: string;
      image: string;
      alt: string;
      detail: ServiceDetail;
    }
  | {
      kind: "work";
      lang: Lang;
      content: Content;
      details: Details;
      key: string;
      title: string;
      image: string;
      alt: string;
      detail: WorkDetail;
      discipline: string;
      badge: string;
    };

function resolve(params: Params): Resolved | null {
  const { lang, section, slug } = params;
  if (!isLang(lang)) return null;

  const kind = sectionKind(lang, section);
  if (!kind) return null;

  const content = getContent(lang);
  const details = getDetails(lang);

  if (kind === "services") {
    const key = serviceKeyFromSlug(lang, slug);
    if (!key) return null;
    const service = content.services.items.find((item) => item.key === key);
    if (!service) return null;
    return {
      kind,
      lang,
      content,
      details,
      key,
      title: service.title,
      image: service.image,
      alt: service.alt,
      detail: details.services[key],
    };
  }

  const key = workKeyFromSlug(lang, slug);
  if (!key) return null;
  const project = content.work.items.find((item) => item.key === key);
  if (!project) return null;
  return {
    kind,
    lang,
    content,
    details,
    key,
    title: project.title,
    image: project.image,
    alt: project.alt,
    detail: details.work[key],
    discipline: project.discipline,
    badge: content.work.conceptLabel,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = resolve(await params);
  if (!resolved) return {};

  const { lang, title, detail, content } = resolved;
  // The same page in the other language, which has its own slug.
  const other: Lang = lang === "nl" ? "en" : "nl";
  const path =
    resolved.kind === "services"
      ? serviceHref(lang, resolved.key)
      : workHref(lang, resolved.key);
  const otherPath =
    resolved.kind === "services"
      ? serviceHref(other, resolved.key)
      : workHref(other, resolved.key);

  return {
    title: `${title} | Sharply`,
    description: detail.tagline,
    alternates: {
      canonical: path,
      languages: { [lang]: path, [other]: otherPath },
    },
    openGraph: {
      title: `${title} | Sharply`,
      description: detail.tagline,
      locale: content.meta.localeTag,
      type: "article",
      url: path,
    },
  };
}

export default async function DetailPage({ params }: { params: Promise<Params> }) {
  const resolved = resolve(await params);
  if (!resolved) notFound();

  const { lang, content, details, title, image, alt, detail } = resolved;
  const copy = details.copy;
  const isService = resolved.kind === "services";
  const discipline = resolved.kind === "work" ? resolved.discipline : null;
  const badge = resolved.kind === "work" ? resolved.badge : null;

  const backHref = isService ? `/${lang}#diensten` : `/${lang}#werk`;
  const backLabel = isService ? copy.backToServices : copy.backToWork;

  // Three siblings to move on to, so the page never dead ends.
  const siblings =
    resolved.kind === "services"
      ? content.services.items
          .filter((item) => item.key !== resolved.key)
          .slice(0, 3)
          .map((item) => ({
            href: serviceHref(lang, item.key),
            title: item.title,
            note: details.services[item.key].tagline,
          }))
      : content.work.items
          .filter((item) => item.key !== resolved.key)
          .map((item) => ({
            href: workHref(lang, item.key),
            title: item.title,
            note: item.discipline,
          }));

  const listTitle = isService ? copy.deliverables : copy.scope;
  const listItems =
    resolved.kind === "services" ? resolved.detail.deliverables : resolved.detail.scope;

  return (
    <main id="main">
      <article>
        {/* Title block. No hero image behind the words: the picture gets its
            own moment below, at full width, where it can actually be seen. */}
        <header className="relative overflow-hidden border-b border-hairline pb-16 pt-32 md:pb-24 md:pt-44">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(70%_100%_at_50%_0%,oklch(0.42_0.14_259/0.35)_0%,transparent_70%)]"
          />

          <div className="container-page">
            <Link
              href={backHref}
              className="group inline-flex items-center gap-2 text-[15px] text-text-muted transition-colors duration-200 ease-out hover:text-text"
            >
              <ArrowLeft
                size={16}
                weight="bold"
                className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-x-0.5"
              />
              {backLabel}
            </Link>

            <h1 className="mt-8 max-w-[18ch] font-display text-[clamp(2.4rem,7vw,5rem)] font-semibold text-text">
              <RevealLines lines={[title]} />
            </h1>

            <p
              data-reveal-hero
              style={{ animationDelay: "0.26s" }}
              className="mt-6 max-w-[54ch] text-[19px] leading-[1.5] text-text-muted md:text-[22px]"
            >
              {detail.tagline}
            </p>

            {discipline ? (
              <div
                data-reveal-hero
                style={{ animationDelay: "0.34s" }}
                className="mt-7 flex flex-wrap items-center gap-2.5"
              >
                <span className="rounded-[var(--radius-pill)] border border-hairline-strong px-3.5 py-1.5 text-[13px] text-text">
                  {discipline}
                </span>
                {badge ? (
                  <span className="rounded-[var(--radius-pill)] border border-hairline px-3.5 py-1.5 text-[13px] text-text-faint">
                    {badge}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>

        {/* The picture, full width. */}
        <div className="container-page -mt-px">
          <RevealImage
            variant="up"
            className="relative mt-12 overflow-hidden rounded-[var(--radius-lg)] border border-hairline md:mt-16"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={image}
                alt={alt}
                fill
                priority
                sizes="(min-width: 1360px) 1280px, 100vw"
                className="object-cover"
              />
            </div>
          </RevealImage>
        </div>

        <div className="container-page">
          <div className="grid gap-y-16 py-20 md:grid-cols-12 md:gap-x-10 md:py-28">
            {/* Intro and the prose. */}
            <div className="md:col-span-7">
              <Reveal>
                <p className="font-display text-[clamp(1.3rem,2.6vw,1.85rem)] font-medium leading-[1.35] tracking-[-0.02em] text-text">
                  {detail.intro}
                </p>
              </Reveal>

              <div className="mt-14 flex flex-col gap-12">
                {detail.sections.map((section, index) => (
                  <section key={section.title} data-scene="panel" data-scene-variant="up">
                    <h2 className="font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-medium text-text">
                      {section.title}
                    </h2>
                    <p className="mt-3.5 max-w-[62ch] text-[17px] leading-[1.65] text-text-muted">
                      {section.body}
                    </p>
                    {index < detail.sections.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="mt-12 block h-px w-16 bg-hairline-strong"
                      />
                    ) : null}
                  </section>
                ))}
              </div>
            </div>

            {/* The list: what you get, or what the concept covers. */}
            <aside className="md:col-span-4 md:col-start-9">
              <div
                data-scene="panel"
                data-scene-variant="right"
                className="glass rounded-[var(--radius-lg)] p-7 md:sticky md:top-28"
              >
                <h2 className="font-display text-[19px] font-medium text-text">
                  {listTitle}
                </h2>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {listItems.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-[1.5] text-text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {resolved.kind === "work" ? (
                  <p className="mt-6 border-t border-hairline pt-5 text-[13px] leading-[1.55] text-text-faint">
                    {resolved.detail.note}
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        </div>

        {/* Questions, on service pages only: a project has no buyer to reassure. */}
        {resolved.kind === "services" ? (
          <DetailQuestions title={copy.questions} items={resolved.detail.questions} />
        ) : null}

        {/* Where to go next. */}
        <section className="border-t border-hairline py-20 md:py-28">
          <div className="container-page">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium text-text">
              <RevealLines
                lines={[isService ? copy.otherServices : copy.otherWork]}
                onView
              />
            </h2>

            <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((sibling, index) => (
                <li key={sibling.href}>
                  <Link
                    href={sibling.href}
                    data-scene="panel"
                    data-scene-variant={index === 0 ? "left" : index === 1 ? "up" : "right"}
                    className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-hairline p-6 transition-[border-color,background-color] duration-200 ease-out hover-fine:hover:border-hairline-strong hover-fine:hover:bg-canvas-raised"
                  >
                    <span className="font-display text-[20px] font-medium text-text">
                      {sibling.title}
                    </span>
                    <span className="mt-2 text-[15px] leading-[1.55] text-text-muted">
                      {sibling.note}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] text-text-faint transition-colors duration-200 ease-out group-hover:text-accent-bright">
                      {copy.readMore}
                      <ArrowUpRight
                        size={14}
                        weight="bold"
                        className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing call. */}
        <section className="border-t border-hairline py-20 md:py-28">
          <div className="container-page">
            <div className="flex flex-col items-start gap-7 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="max-w-[16ch] font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text">
                  <RevealLines lines={[copy.ctaTitle]} onView />
                </h2>
                <Reveal delay={0.06}>
                  <p className="mt-4 max-w-[48ch] text-[17px] leading-[1.6] text-text-muted">
                    {copy.ctaBody}
                  </p>
                </Reveal>
              </div>
              <Reveal delay={0.1}>
                <Link
                  href={`/${lang}#contact`}
                  className="group inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-[16px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:bg-accent-bright"
                >
                  {copy.ctaButton}
                  <ArrowUpRight
                    size={18}
                    weight="bold"
                    className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
