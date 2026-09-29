import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getDetails } from "@/content";

/*
  A dead link still deserves a page rather than a wall of default text. This one
  is Dutch, because a not-found page cannot read the route params it was reached
  through: Next renders it outside the segment that knows the language. Dutch is
  the default language of the site, so it is the safer of the two.
*/
export default function NotFound() {
  const { notFound } = getDetails("nl").copy;

  return (
    <main id="main" className="relative flex min-h-[80vh] items-center py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(70%_100%_at_50%_0%,oklch(0.42_0.14_259/0.3)_0%,transparent_70%)]"
      />
      <div className="container-page">
        <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-text-faint">
          404
        </p>
        <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold text-text">
          {notFound.title}
        </h1>
        <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.6] text-text-muted">
          {notFound.body}
        </p>
        <Link
          href="/nl"
          className="group mt-9 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-[16px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:bg-accent-bright"
        >
          <ArrowLeft
            size={17}
            weight="bold"
            className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-x-0.5"
          />
          {notFound.home}
        </Link>
      </div>
    </main>
  );
}
