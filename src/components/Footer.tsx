import Link from "next/link";
import { Mark } from "./Wordmark";
import type { Content, Lang } from "@/content";

export function Footer({ content, lang }: { content: Content; lang: Lang }) {
  const otherLang: Lang = lang === "nl" ? "en" : "nl";
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-canvas-deep pt-20">
      <div className="container-page">
        <div className="grid gap-10 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium text-text">
              {content.footer.contactTitle}
            </h2>
            <a
              href={`mailto:${content.footer.email}`}
              className="mt-3 inline-block text-[17px] text-accent-bright underline decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-200 ease-out hover:decoration-accent-bright"
            >
              {content.footer.email}
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="text-[14px] font-medium text-text">
              {content.footer.socialTitle}
            </p>
            <p className="mt-3 text-[15px] text-text-faint">
              {content.footer.socialNote}
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-[15px] text-text-muted">{content.footer.legalNote}</p>
            <ul className="mt-3 flex flex-col gap-1">
              {content.footer.placeholders.map((item) => (
                <li key={item} className="text-[14px] text-text-faint">
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={`/${otherLang}`}
              className="mt-5 inline-block font-mono text-[12px] uppercase tracking-[0.12em] text-text-muted transition-colors duration-200 ease-out hover:text-text"
            >
              {otherLang === "en" ? "English" : "Nederlands"}
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-hairline py-6">
          <p className="text-[13px] text-text-faint">
            {year} Sharply. {content.footer.rights}
          </p>
          <Mark className="h-4 w-4 shrink-0 text-text-faint" />
        </div>
      </div>

      <div aria-hidden="true" className="relative select-none">
        <span className="block translate-y-[0.22em] text-center font-display text-[clamp(5rem,21vw,19rem)] font-semibold leading-[0.8] tracking-[-0.055em] text-text/[0.055]">
          sharply
        </span>
      </div>
    </footer>
  );
}
