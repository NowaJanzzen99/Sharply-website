"use client";

import { useStepIndex } from "@/lib/use-track-progress";
import type { DetailSection } from "@/content";

/*
  The body of a detail page: an index that tracks where you are reading, and
  the prose beside it.

  The index is not decoration. Four blocks of text on a long page is exactly
  the point where someone wants to know how much is left and to jump to the
  part they came for, and the rail answers both without taking any room. It
  uses the same step observer as the process section on the homepage, so the
  page has one way of tracking reading position rather than two.

  Below the medium breakpoint the index disappears: on a phone it would cost
  a third of the screen to tell you something the scrollbar already says.
*/
export function DetailChapters({ sections }: { sections: DetailSection[] }) {
  const { container, index } = useStepIndex<HTMLDivElement>(sections.length);

  return (
    <div ref={container} className="container-page">
      <div className="grid gap-y-14 py-20 md:grid-cols-12 md:gap-x-10 md:py-28">
        <nav
          aria-label="Op deze pagina"
          className="hidden md:col-span-3 md:block"
        >
          <ol className="sticky top-28 flex flex-col gap-0.5 border-l border-hairline">
            {sections.map((section, i) => (
              <li key={section.title}>
                <a
                  href={`#chapter-${i}`}
                  aria-current={i === index ? "true" : undefined}
                  className="block border-l-2 py-2 pl-5 text-[14px] leading-[1.4] transition-[color,border-color,transform] duration-300 ease-[var(--ease-out)]"
                  style={{
                    color: i === index ? "var(--text)" : "var(--text-faint)",
                    borderColor: i === index ? "var(--accent)" : "transparent",
                    transform: i === index ? "translateX(2px)" : "translateX(0)",
                    marginLeft: "-1px",
                  }}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-14 md:col-span-8 md:col-start-5 md:gap-20">
          {sections.map((section, i) => (
            <section
              key={section.title}
              id={`chapter-${i}`}
              data-step={i}
              data-scene="panel"
              data-scene-variant="up"
              className="scroll-mt-28"
            >
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.15rem)] font-medium leading-[1.2] tracking-[-0.025em] text-text">
                {section.title}
              </h2>
              <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.7] text-text-muted md:text-[18px]">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
