"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowCounterClockwise, CheckCircle, Info, Warning, X } from "@phosphor-icons/react";
import type { Content, Lang } from "@/content";
import {
  BUDGET_MAX,
  estimate,
  fitToBudget,
  formatEuro,
  restoreLine,
  type Line,
} from "@/lib/estimate";
import type { Values } from "./form-model";

/*
  The package on the last step of the form, and the way to make it fit.

  The form is a questionnaire, but what someone wants to know at the end is
  one thing: what does this cost, and what can I do about it? So the answers
  become a list of things, each with its price and a button that takes it out.
  The total follows at once. Someone with less to spend never has to guess
  which of their wishes is the expensive one, and never has to start over: they
  take things out until it fits, and anything can be put back.

  The budget they gave earlier sits on top as a set of buttons. When the
  package is over it, one button takes things out, biggest first, until it
  fits. When even the smallest version is over, it says so and offers an email
  instead of pretending something fits.

  The number is still a range and still says it is not a quote: a form cannot
  know everything, and a figure that pretends otherwise has to be walked back.
*/

type Copy = Content["contact"];

/** Every option label in the form, so a line can be named the way it was asked. */
export function labeller(copy: Copy) {
  const table = new Map<string, string>();
  const collect = (fields: Copy["steps"][number]["fields"]) => {
    fields.forEach((field) => {
      if (field.kind === "chips" || field.kind === "select") {
        field.options.forEach((option) => table.set(`${field.id}:${option.id}`, option.label));
      }
    });
  };
  copy.steps.forEach((step) => collect(step.fields));
  copy.detailGroups.forEach((group) => collect(group.fields));
  return (fieldId: string, optionId?: string) =>
    optionId === undefined ? undefined : table.get(`${fieldId}:${optionId}`);
}

/** The estimate, computed the same way everywhere it is shown. */
export function estimateFor(copy: Copy, values: Values) {
  return estimate(values, labeller(copy), copy.price.perItem, copy.price.rush);
}

/**
 * Counts from where it was to where it is going, so taking something out
 * reads as the total dropping, not as a new number appearing.
 */
function Counter({ to, lang }: { to: number; lang: Lang }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = to;
      el.textContent = formatEuro(to, lang);
      return;
    }

    const from = shown.current;
    const duration = from === 0 ? 900 : 450;
    let frame = 0;
    const started = performance.now();
    const run = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) ** 3;
      // In steps of fifty, so the digits never show a figure we would not print.
      shown.current = Math.round((from + (to - from) * eased) / 50) * 50;
      el.textContent = formatEuro(shown.current, lang);
      if (t < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [to, lang]);

  return <span ref={ref}>{formatEuro(to, lang)}</span>;
}

/** A raised, pressable button: the look of something you can do, not of a tag. */
const BUTTON =
  "inline-flex min-h-[40px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-hairline-strong bg-[linear-gradient(180deg,oklch(0.26_0.035_264),oklch(0.2_0.03_264))] px-3.5 text-[13px] font-medium text-text shadow-[inset_0_1px_0_oklch(0.98_0.01_264/0.14),0_6px_14px_oklch(0.05_0.02_264/0.5)] transition-[transform,border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px active:scale-[0.98] active:shadow-[inset_0_1px_0_oklch(0.98_0.01_264/0.08),0_2px_6px_oklch(0.05_0.02_264/0.5)] hover-fine:hover:-translate-y-px hover-fine:hover:border-accent";

const ACCENT_BUTTON =
  "inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 text-[14px] font-medium text-accent-ink shadow-[inset_0_1px_0_oklch(0.98_0.01_264/0.35),0_8px_18px_oklch(0.4_0.16_259/0.35)] transition-[transform,background-color] duration-150 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright active:translate-y-px active:scale-[0.98] hover-fine:hover:bg-accent-bright";

const rowMotion = {
  initial: { opacity: 0, transform: "translateX(-12px)" },
  animate: { opacity: 1, transform: "translateX(0px)" },
  exit: { opacity: 0, transform: "translateX(28px)" },
  transition: { duration: 0.24, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
};

export function PackageBuilder({
  copy,
  values,
  baseline,
  lang,
  email,
  onChange,
}: {
  copy: Copy;
  values: Values;
  /** The answers as they were when the review opened, so anything can be put back. */
  baseline: Values;
  lang: Lang;
  email: string;
  onChange: (next: Values) => void;
}) {
  const price = copy.price;
  const money = (n: number) => formatEuro(n, lang);

  const result = estimateFor(copy, values);
  const start = estimateFor(copy, baseline);

  const budgetField = copy.steps
    .flatMap((step) => step.fields)
    .find((field) => field.id === "plan.budget");
  const budgetOptions = budgetField && budgetField.kind === "chips" ? budgetField.options : [];
  const budgetId = String(values["plan.budget"] ?? "");
  const max = BUDGET_MAX[budgetId];

  // What has been taken out since the review opened, and can be put back.
  const gone = (start?.lines ?? []).filter((line) => {
    if (result?.lines.some((current) => current.id === line.id)) return false;
    // A service's own extras go with it: only the service is shown as removed.
    const owner = start?.lines.find((candidate) => candidate.id === `need:${line.group}`);
    if (line.kind === "extra" && owner && !result?.lines.some((current) => current.id === owner.id)) {
      return false;
    }
    return true;
  });
  const careGone = Boolean(start?.monthly && !result?.monthly);

  const state: "none" | "fits" | "maybe" | "over" =
    !result || max === undefined
      ? "none"
      : result.high <= max
        ? "fits"
        : result.low <= max
          ? "maybe"
          : "over";

  const fitted =
    state === "over" || state === "maybe"
      ? fitToBudget(values, labeller(copy), max, price.perItem, price.rush)
      : null;
  const fittedResult = fitted ? estimateFor(copy, fitted) : null;
  // Even with everything taken out that can be, it still does not fit.
  const floor =
    result && max !== undefined && Number.isFinite(max) && result.high > max
      ? estimateFor(copy, fitToBudget(values, labeller(copy), 0, price.perItem, price.rush))
      : null;
  const stuck = Boolean(floor && floor.high > max);

  const needs = Array.isArray(values["needs.needs"]) ? values["needs.needs"] : [];
  const canOnePage =
    needs.includes("website") && values["website.pages"] !== "1" && (state === "over" || state === "maybe");

  function putBack(line: Line) {
    onChange(restoreLine(baseline, values, line));
  }

  function putBackCare() {
    onChange({
      ...values,
      "plan.maintenance": baseline["plan.maintenance"] ?? "studio",
      "website.editing": baseline["website.editing"] ?? "self",
    });
  }

  const services = result?.lines.filter((line) => line.kind === "need") ?? [];
  const rush = result?.lines.find((line) => line.kind === "rush");

  function removeRow(line: Line) {
    return (
      <button
        type="button"
        onClick={() => onChange(line.without)}
        aria-label={price.removeLabel.replace("{item}", line.label)}
        className={BUTTON}
      >
        <X size={14} weight="bold" aria-hidden="true" />
        {price.remove}
      </button>
    );
  }

  return (
    <section aria-labelledby="price-estimate" className="glass mb-9 rounded-[var(--radius-lg)] p-5 sm:p-7">
      <h3 id="price-estimate" className="font-display text-[22px] font-medium text-text">
        {price.packageTitle}
      </h3>
      <p className="mt-1 text-[14px] leading-[1.5] text-text-muted">{price.packageHint}</p>

      {result ? (
        <>
          <p className="mt-6 font-display text-[clamp(1.75rem,5vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-text">
            <Counter to={result.low} lang={lang} />
            <span className="mx-2 text-text-faint">{price.to}</span>
            <Counter to={result.high} lang={lang} />
          </p>
          <p className="mt-2 text-[13px] text-text-faint">{price.vat}</p>
        </>
      ) : (
        <p className="mt-6 text-[15px] text-text-muted">{price.emptyPackage}</p>
      )}

      {/* Budget */}
      <div className="mt-6 rounded-[var(--radius-md)] border border-hairline p-4">
        <p id="budget-label" className="text-[13px] font-medium text-text-muted">
          {price.budgetLabel}
        </p>
        <div role="group" aria-labelledby="budget-label" className="mt-3 flex flex-wrap gap-2">
          {budgetOptions
            .filter((option) => option.id in BUDGET_MAX)
            .map((option) => {
              const on = budgetId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onChange({ ...values, "plan.budget": option.id })}
                  className={`min-h-[40px] cursor-pointer rounded-[var(--radius-pill)] border px-3.5 text-[13px] transition-[transform,border-color,background-color] duration-150 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97] ${
                    on
                      ? "border-accent bg-accent/20 text-text"
                      : "border-hairline-strong text-text-muted hover-fine:hover:border-accent hover-fine:hover:text-text"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
        </div>

        <div aria-live="polite" className="mt-4">
          {state === "none" && result ? (
            <p className="flex items-start gap-2 text-[14px] text-text-muted">
              <Info size={17} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
              {price.budgetPick}
            </p>
          ) : null}

          {state === "fits" ? (
            <p className="flex items-start gap-2 text-[14px] text-text">
              <CheckCircle
                size={17}
                weight="fill"
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[oklch(0.78_0.17_150)]"
              />
              {price.budgetFits}
            </p>
          ) : null}

          {state === "maybe" || state === "over" ? (
            <div className="flex flex-col gap-3">
              <p className="flex items-start gap-2 text-[14px] text-text">
                <Warning
                  size={17}
                  weight="fill"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[oklch(0.82_0.15_80)]"
                />
                {state === "maybe"
                  ? price.budgetMaybe
                  : price.budgetOver.replace("{amount}", money((result?.low ?? 0) - max))}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {fittedResult && fittedResult.high !== result?.high ? (
                  <button type="button" onClick={() => onChange(fitted!)} className={ACCENT_BUTTON}>
                    {price.fit}
                  </button>
                ) : null}
                {canOnePage ? (
                  <button
                    type="button"
                    onClick={() => onChange({ ...values, "website.pages": "1" })}
                    className={BUTTON}
                  >
                    {price.onePage}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {stuck && floor ? (
            <p className="mt-3 text-[14px] leading-[1.6] text-text-muted">
              {price.floor.replace("{amount}", money(floor.high))}{" "}
              <a
                href={`mailto:${email}`}
                className="text-text underline decoration-hairline-strong underline-offset-4 transition-colors duration-200 ease-out hover:decoration-accent"
              >
                {price.floorMail}
              </a>
            </p>
          ) : null}
        </div>
      </div>

      {/* The things in the package */}
      {result ? (
        <ul className="mt-6 flex flex-col">
          <AnimatePresence initial={false} mode="popLayout">
            {services.map((service) => (
              <motion.li
                key={service.id}
                layout="position"
                {...rowMotion}
                className="border-t border-hairline py-4 first:border-t-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[16px] font-medium text-text">{service.label}</p>
                    <p className="mt-0.5 text-[13px] text-text-muted">
                      {money(service.low)} {price.to} {money(service.high)}
                    </p>
                  </div>
                  {services.length > 1 ? removeRow(service) : null}
                </div>

                {service.group === "website" && result.onePage && baseline["website.pages"] !== "1" ? (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({ ...values, "website.pages": String(baseline["website.pages"] ?? "1-5") })
                    }
                    className={`${BUTTON} mt-3`}
                  >
                    <ArrowCounterClockwise size={14} weight="bold" aria-hidden="true" />
                    {price.onePageBack}
                  </button>
                ) : null}

                <ul className="mt-2 flex flex-col">
                  <AnimatePresence initial={false} mode="popLayout">
                    {result.lines
                      .filter((line) => line.kind === "extra" && line.group === service.group)
                      .map((line) => (
                        <motion.li
                          key={line.id}
                          layout="position"
                          {...rowMotion}
                          className="flex items-center justify-between gap-3 border-t border-hairline/60 py-2.5 pl-4"
                        >
                          <div className="min-w-0">
                            <p className="text-[15px] text-text">{line.label}</p>
                            <p className="text-[13px] text-text-muted">
                              + {money(line.low)} {price.to} {money(line.high)}
                            </p>
                          </div>
                          {removeRow(line)}
                        </motion.li>
                      ))}
                  </AnimatePresence>
                </ul>
              </motion.li>
            ))}

            {rush ? (
              <motion.li
                key={rush.id}
                layout="position"
                {...rowMotion}
                className="flex items-center justify-between gap-3 border-t border-hairline py-4"
              >
                <div className="min-w-0">
                  <p className="text-[15px] text-text">{rush.label}</p>
                  <p className="text-[13px] text-text-muted">
                    + {money(rush.low)} {price.to} {money(rush.high)}
                  </p>
                </div>
                {removeRow(rush)}
              </motion.li>
            ) : null}

            {result.monthly ? (
              <motion.li
                key="care"
                layout="position"
                {...rowMotion}
                className="flex items-center justify-between gap-3 border-t border-hairline py-4"
              >
                <div className="min-w-0">
                  <p className="text-[15px] text-text">{price.monthlyLabel}</p>
                  <p className="text-[13px] text-text-muted">
                    {price.care
                      .replace("{plan}", price.plans[result.monthly.plan])
                      .replace("{price}", money(result.monthly.price))}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(result.monthly!.without)}
                  aria-label={price.removeLabel.replace("{item}", price.monthlyLabel)}
                  className={BUTTON}
                >
                  <X size={14} weight="bold" aria-hidden="true" />
                  {price.remove}
                </button>
              </motion.li>
            ) : null}
          </AnimatePresence>
        </ul>
      ) : null}

      {/* What was taken out, one tap from coming back */}
      {gone.length > 0 || careGone ? (
        <div className="mt-5 border-t border-hairline pt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-medium text-text-faint">{price.removedTitle}</p>
            <button type="button" onClick={() => onChange(baseline)} className={BUTTON}>
              <ArrowCounterClockwise size={14} weight="bold" aria-hidden="true" />
              {price.restoreAll}
            </button>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {gone.map((line) => (
              <li
                key={line.id}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-dashed border-hairline-strong px-3.5 py-2.5"
              >
                <p className="min-w-0 text-[14px] text-text-muted line-through decoration-text-faint">
                  {line.label}
                </p>
                <button
                  type="button"
                  onClick={() => putBack(line)}
                  aria-label={`${price.restore}: ${line.label}`}
                  className={BUTTON}
                >
                  <ArrowCounterClockwise size={14} weight="bold" aria-hidden="true" />
                  {price.restore}
                </button>
              </li>
            ))}
            {careGone ? (
              <li className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-dashed border-hairline-strong px-3.5 py-2.5">
                <p className="min-w-0 text-[14px] text-text-muted line-through decoration-text-faint">
                  {price.monthlyLabel}
                </p>
                <button type="button" onClick={putBackCare} className={BUTTON}>
                  <ArrowCounterClockwise size={14} weight="bold" aria-hidden="true" />
                  {price.restore}
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 border-t border-hairline pt-5 text-[14px] leading-[1.6] text-text-faint">
        {result?.open ? `${price.open} ` : ""}
        {price.note}
      </p>
    </section>
  );
}
