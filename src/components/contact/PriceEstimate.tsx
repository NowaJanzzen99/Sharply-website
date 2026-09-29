"use client";

import { useEffect, useRef } from "react";
import type { Content, Lang } from "@/content";
import { estimate, formatEuro } from "@/lib/estimate";
import type { Values } from "./form-model";

/*
  The price indication on the last step of the form.

  It answers the question everybody has and nobody asks first. The number is a
  range, it names which of your own answers moved it, and it says in plain
  words that it is not a quote: a form cannot know everything, and a figure
  that pretends otherwise would have to be walked back later, which is worse
  than saying so now.

  The figures count up when the card arrives. A number that lands already
  finished is just text; one that runs up reads as something being worked out.
*/

/** Every option label in the form, so a driver can be named the way it was asked. */
function labeller(copy: Content["contact"]) {
  const table = new Map<string, string>();
  const collect = (fields: Content["contact"]["steps"][number]["fields"]) => {
    fields.forEach((field) => {
      if (field.kind === "chips" || field.kind === "select") {
        field.options.forEach((option) => table.set(`${field.id}:${option.id}`, option.label));
      }
    });
  };
  copy.steps.forEach((step) => collect(step.fields));
  copy.detailGroups.forEach((group) => collect(group.fields));
  return (fieldId: string, optionId: string) => table.get(`${fieldId}:${optionId}`);
}

function Counter({ to, lang }: { to: number; lang: Lang }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = formatEuro(to, lang);
      return;
    }

    let frame = 0;
    const started = performance.now();
    const run = (now: number) => {
      const t = Math.min(1, (now - started) / 900);
      const eased = 1 - (1 - t) ** 3;
      // Counts in hundreds, so the digits never show a figure we would not print.
      el.textContent = formatEuro(Math.round((to * eased) / 100) * 100, lang);
      if (t < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [to, lang]);

  return <span ref={ref}>{formatEuro(to, lang)}</span>;
}

export function PriceEstimate({
  copy,
  values,
  lang,
}: {
  copy: Content["contact"];
  values: Values;
  lang: Lang;
}) {
  const result = estimate(values, labeller(copy));
  if (!result) return null;

  const price = copy.price;

  return (
    <section
      aria-labelledby="price-estimate"
      className="glass mb-9 rounded-[var(--radius-lg)] p-6 sm:p-7"
    >
      <h3 id="price-estimate" className="text-[14px] font-medium text-text-muted">
        {price.title}
      </h3>

      <p className="mt-3 font-display text-[clamp(1.75rem,5vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text">
        <Counter to={result.low} lang={lang} />
        <span className="mx-2 text-text-faint">{price.to}</span>
        <Counter to={result.high} lang={lang} />
      </p>

      {result.monthly ? (
        <p className="mt-2 text-[15px] text-text-muted">
          {price.care
            .replace("{low}", formatEuro(result.monthly[0], lang))
            .replace("{high}", formatEuro(result.monthly[1], lang))}
        </p>
      ) : null}

      {result.drivers.length > 0 ? (
        <div className="mt-5">
          <p className="text-[13px] text-text-faint">{price.driversTitle}</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {result.drivers.map((driver) => (
              <li
                key={driver}
                className="rounded-[var(--radius-pill)] border border-hairline px-3 py-1.5 text-[13px] text-text-muted"
              >
                {driver}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 border-t border-hairline pt-5 text-[14px] leading-[1.6] text-text-faint">
        {result.open ? `${price.open} ` : ""}
        {price.note}
      </p>
    </section>
  );
}
