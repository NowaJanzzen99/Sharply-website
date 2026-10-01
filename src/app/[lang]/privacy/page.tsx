import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { RevealLines } from "@/components/Reveal";
import { getContent, isLang, LANGS } from "@/content";

/*
  The privacy statement: plain text, in the same voice as the rest of the site.
  It lists what the form collects, why, who processes it and for how long,
  because those are the questions a careful client asks before typing an
  email address into a stranger's form.
*/

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const content = getContent(lang);
  return {
    title: `${content.privacy.title} | Sharply`,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { nl: "/nl/privacy", en: "/en/privacy" },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { privacy } = getContent(lang);

  return (
    <main id="main">
      <article className="container-page pb-28 pt-32 md:pb-40 md:pt-44">
        <Link
          href={`/${lang}`}
          className="group inline-flex items-center gap-2 text-[15px] text-text-muted transition-colors duration-200 ease-out hover:text-text"
        >
          <ArrowLeft
            size={16}
            weight="bold"
            className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-x-0.5"
          />
          {lang === "nl" ? "Terug naar de site" : "Back to the site"}
        </Link>

        <h1 className="mt-8 font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold text-text">
          <RevealLines lines={[privacy.title]} />
        </h1>
        <p className="mt-4 text-[15px] text-text-faint">{privacy.updated}</p>

        <div className="mt-14 max-w-[68ch]">
          {privacy.sections.map((section) => (
            <section key={section.title} className="border-t border-hairline py-9 first:border-t-0">
              <h2 className="font-display text-[clamp(1.2rem,2.2vw,1.5rem)] font-medium text-text">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-[16px] leading-[1.7] text-text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
