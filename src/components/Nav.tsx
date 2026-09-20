"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Wordmark } from "./Wordmark";
import type { Content, Lang } from "@/content";

export function Nav({ content, lang }: { content: Content; lang: Lang }) {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (value) => {
    setCondensed(value > 24);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const otherLang: Lang = lang === "nl" ? "en" : "nl";
  const otherHref = pathname.replace(`/${lang}`, `/${otherLang}`) || `/${otherLang}`;

  return (
    <header
      className="fixed inset-x-0 top-0"
      style={{ zIndex: "var(--z-nav)" }}
    >
      <div className="container-page">
        <div
          className={`mt-3 flex h-14 items-center justify-between rounded-[var(--radius-pill)] px-3 pl-5 transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--ease-out)] md:h-16 ${
            condensed
              ? "glass shadow-[0_8px_30px_oklch(0.09_0.02_264/0.45)]"
              : "border border-transparent"
          }`}
        >
          <Link
            href={`/${lang}`}
            className="text-[17px] text-text"
            aria-label="Sharply"
          >
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Hoofdmenu">
            {content.nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-[var(--radius-pill)] px-4 py-2 text-[15px] text-text-muted transition-colors duration-200 ease-out hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className="hidden items-center rounded-[var(--radius-pill)] border border-hairline p-0.5 sm:flex"
              role="group"
              aria-label={content.nav.langLabel}
            >
              <span
                aria-current="true"
                className="rounded-[var(--radius-pill)] bg-accent px-2.5 py-1 font-mono text-[11px] uppercase text-accent-ink"
              >
                {lang}
              </span>
              <Link
                href={otherHref}
                className="rounded-[var(--radius-pill)] px-2.5 py-1 font-mono text-[11px] uppercase text-text-faint transition-colors duration-200 ease-out hover:text-text"
              >
                {otherLang}
              </Link>
            </div>

            <a
              href="#contact"
              className="hidden rounded-[var(--radius-pill)] bg-text px-4 py-2.5 text-[14px] font-medium text-canvas-deep transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] sm:inline-block"
            >
              {content.nav.cta}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={content.nav.menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-pill)] text-text transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] lg:hidden"
            >
              <List size={22} weight="regular" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <motion.div
          className="fixed inset-0 bg-canvas-deep/95 backdrop-blur-xl lg:hidden"
          style={{ zIndex: "var(--z-overlay)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="container-page flex h-full flex-col">
            <div className="mt-3 flex h-14 items-center justify-between pl-5 md:h-16">
              <Wordmark className="text-[17px]" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={content.nav.menuClose}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-pill)] text-text transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-1" aria-label="Hoofdmenu">
              {content.nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-[32px] font-medium tracking-[-0.03em] text-text"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto mb-10 flex flex-col gap-4">
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="rounded-[var(--radius-pill)] bg-accent px-5 py-3.5 text-center text-[16px] font-medium text-accent-ink transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
              >
                {content.nav.cta}
              </a>
              <Link
                href={otherHref}
                onClick={() => setMenuOpen(false)}
                className="text-center text-[15px] text-text-muted"
              >
                {otherLang === "en" ? "English" : "Nederlands"}
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}
