"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/content";

/*
  The language switch.

  Swapping "/nl" for "/en" in the address only works on the homepage. Every
  detail page has a translated path segment and a translated slug, so the
  counterpart is looked up in a map the server built (getAlternates) and
  handed down. Anything not in the map, which is only ever the homepage and
  hash links to it, falls back to the swap.
*/
export function LangLink({
  lang,
  other,
  alternates,
  className,
  children,
  onClick,
}: {
  lang: Lang;
  other: Lang;
  alternates: Record<string, string>;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname() || `/${lang}`;
  // Trailing slashes are not how the pages are addressed, but a visitor can type one.
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const href = alternates[clean] ?? clean.replace(`/${lang}`, `/${other}`) ?? `/${other}`;

  return (
    <Link
      href={href}
      hrefLang={other}
      className={className}
      onClick={() => {
        // Remember the choice for a year, so a bare address keeps sending this
        // visitor to the language they picked. Read by src/proxy.ts.
        document.cookie = `sharply-lang=${other}; path=/; max-age=31536000; samesite=lax`;
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
