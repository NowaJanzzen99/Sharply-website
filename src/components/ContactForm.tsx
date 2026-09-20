"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Reveal, RevealLines, splitHeading } from "./Reveal";
import Image from "next/image";
import type { Content, Lang } from "@/content";

type Values = {
  needs: string[];
  project: string;
  references: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
};

const EMPTY: Values = {
  needs: [],
  project: "",
  references: "",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  website: "",
};

const TOTAL_STEPS = 4;

const fieldClass =
  "w-full rounded-[var(--radius-md)] border border-hairline-strong bg-canvas-deep px-4 py-3 text-[16px] text-text placeholder:text-text-faint transition-colors duration-200 ease-out hover:border-hairline-strong focus:border-accent";

export function ContactForm({
  content,
  lang,
}: {
  content: Content;
  lang: Lang;
}) {
  const copy = content.contact;
  const uid = useId();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate(index: number) {
    const next: Partial<Record<keyof Values, string>> = {};

    if (index === 0 && values.needs.length === 0) {
      next.needs = copy.pickOne;
    }
    if (index === 1 && values.project.trim().length < 10) {
      next.project = values.project.trim() ? copy.tooShort : copy.required;
    }
    if (index === 2) {
      if (!values.budget) next.budget = copy.pickOne;
      if (!values.timeline) next.timeline = copy.pickOne;
    }
    if (index === 3) {
      if (values.name.trim().length < 2) next.name = copy.required;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        next.email = values.email.trim() ? copy.invalidEmail : copy.required;
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validate(step)) return;
    setDirection(1);
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate(3)) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, lang }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  function restart() {
    setValues(EMPTY);
    setErrors({});
    setStep(0);
    setStatus("idle");
  }

  const enter = { opacity: 0, transform: `translateX(${direction * 28}px)` };
  const exit = { opacity: 0, transform: `translateX(${direction * -28}px)` };

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-hairline py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
      >
        <Image
          src="/images/bg-iridescent.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
              <RevealLines lines={splitHeading(copy.title)} onView />
            </h2>
            <Reveal delay={0.06}>
              <p className="mt-5 max-w-[40ch] text-[17px] leading-[1.6] text-text-muted">
                {copy.lead}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href={`mailto:${content.footer.email}`}
                className="mt-8 inline-block text-[16px] text-text underline decoration-hairline-strong underline-offset-[6px] transition-colors duration-200 ease-out hover:decoration-accent"
              >
                {content.footer.email}
              </a>
            </Reveal>
          </div>

          <Reveal className="md:col-span-7" delay={0.08}>
            <div className="glass rounded-[var(--radius-lg)] p-6 md:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-start py-6"
                  >
                    <CheckCircle size={32} weight="fill" className="text-accent-bright" />
                    <h3 className="mt-5 font-display text-[26px] font-medium text-text">
                      {copy.successTitle}
                    </h3>
                    <p className="mt-3 max-w-[44ch] text-[16px] leading-[1.6] text-text-muted">
                      {copy.successBody}
                    </p>
                    <button
                      type="button"
                      onClick={restart}
                      className="mt-6 text-[15px] text-text-muted underline underline-offset-4 transition-colors duration-200 ease-out hover:text-text"
                    >
                      {copy.againLabel}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    noValidate
                    initial={false}
                    className="flex flex-col"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-text-faint">
                        {copy.progress
                          .replace("{current}", String(step + 1))
                          .replace("{total}", String(TOTAL_STEPS))}
                      </p>
                      <span
                        aria-hidden="true"
                        className="h-[2px] w-28 overflow-hidden rounded-[var(--radius-pill)] bg-hairline-strong"
                      >
                        <motion.span
                          className="block h-full w-full origin-left bg-accent"
                          animate={{
                            transform: `scaleX(${(step + 1) / TOTAL_STEPS})`,
                          }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        />
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-[24px] font-medium text-text">
                      {copy.steps[step].title}
                    </h3>
                    <p className="mt-1.5 text-[15px] text-text-faint">
                      {copy.steps[step].hint}
                    </p>

                    <div className="mt-7 min-h-[16rem]">
                      <AnimatePresence mode="wait" custom={direction} initial={false}>
                        <motion.div
                          key={step}
                          initial={enter}
                          animate={{ opacity: 1, transform: "translateX(0px)" }}
                          exit={exit}
                          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                        >
                          {step === 0 ? (
                            <fieldset>
                              <legend className="sr-only">{copy.needsLabel}</legend>
                              <div className="flex flex-wrap gap-2">
                                {copy.needs.map((need) => {
                                  const active = values.needs.includes(need.id);
                                  return (
                                    <label
                                      key={need.id}
                                      className={`cursor-pointer rounded-[var(--radius-pill)] border px-4 py-2.5 text-[15px] transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97] ${
                                        active
                                          ? "border-accent bg-accent text-accent-ink"
                                          : "border-hairline-strong text-text-muted hover:border-text-faint hover:text-text"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={active}
                                        onChange={() =>
                                          set(
                                            "needs",
                                            active
                                              ? values.needs.filter((id) => id !== need.id)
                                              : [...values.needs, need.id],
                                          )
                                        }
                                      />
                                      {need.label}
                                    </label>
                                  );
                                })}
                              </div>
                              {errors.needs ? (
                                <p role="alert" className="mt-3 flex items-center gap-1.5 text-[14px] text-accent-bright">
                                  <WarningCircle size={15} weight="fill" />
                                  {errors.needs}
                                </p>
                              ) : null}
                            </fieldset>
                          ) : null}

                          {step === 1 ? (
                            <div className="flex flex-col gap-5">
                              <div>
                                <label
                                  htmlFor={`${uid}-project`}
                                  className="block text-[14px] font-medium text-text"
                                >
                                  {copy.projectLabel}
                                </label>
                                <textarea
                                  id={`${uid}-project`}
                                  rows={4}
                                  value={values.project}
                                  onChange={(event) => set("project", event.target.value)}
                                  onBlur={() => {
                                    if (values.project.trim() && values.project.trim().length < 10) {
                                      setErrors((c) => ({ ...c, project: copy.tooShort }));
                                    }
                                  }}
                                  placeholder={copy.projectPlaceholder}
                                  aria-invalid={Boolean(errors.project)}
                                  aria-describedby={errors.project ? `${uid}-project-error` : undefined}
                                  className={`mt-2 ${fieldClass} resize-y`}
                                />
                                {errors.project ? (
                                  <p
                                    id={`${uid}-project-error`}
                                    role="alert"
                                    className="mt-2 flex items-center gap-1.5 text-[14px] text-accent-bright"
                                  >
                                    <WarningCircle size={15} weight="fill" />
                                    {errors.project}
                                  </p>
                                ) : null}
                              </div>

                              <div>
                                <label
                                  htmlFor={`${uid}-refs`}
                                  className="block text-[14px] font-medium text-text"
                                >
                                  {copy.referencesLabel}{" "}
                                  <span className="text-text-faint">({copy.optional})</span>
                                </label>
                                <textarea
                                  id={`${uid}-refs`}
                                  rows={2}
                                  value={values.references}
                                  onChange={(event) => set("references", event.target.value)}
                                  placeholder={copy.referencesPlaceholder}
                                  className={`mt-2 ${fieldClass} resize-y`}
                                />
                              </div>
                            </div>
                          ) : null}

                          {step === 2 ? (
                            <div className="flex flex-col gap-7">
                              <fieldset>
                                <legend className="text-[14px] font-medium text-text">
                                  {copy.budgetLabel}
                                </legend>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {copy.budgets.map((option) => (
                                    <label
                                      key={option.id}
                                      className={`cursor-pointer rounded-[var(--radius-pill)] border px-4 py-2.5 text-[15px] transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97] ${
                                        values.budget === option.id
                                          ? "border-accent bg-accent text-accent-ink"
                                          : "border-hairline-strong text-text-muted hover:border-text-faint hover:text-text"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name="budget"
                                        className="sr-only"
                                        checked={values.budget === option.id}
                                        onChange={() => set("budget", option.id)}
                                      />
                                      {option.label}
                                    </label>
                                  ))}
                                </div>
                                {errors.budget ? (
                                  <p role="alert" className="mt-3 flex items-center gap-1.5 text-[14px] text-accent-bright">
                                    <WarningCircle size={15} weight="fill" />
                                    {errors.budget}
                                  </p>
                                ) : null}
                              </fieldset>

                              <fieldset>
                                <legend className="text-[14px] font-medium text-text">
                                  {copy.timelineLabel}
                                </legend>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {copy.timelines.map((option) => (
                                    <label
                                      key={option.id}
                                      className={`cursor-pointer rounded-[var(--radius-pill)] border px-4 py-2.5 text-[15px] transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97] ${
                                        values.timeline === option.id
                                          ? "border-accent bg-accent text-accent-ink"
                                          : "border-hairline-strong text-text-muted hover:border-text-faint hover:text-text"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name="timeline"
                                        className="sr-only"
                                        checked={values.timeline === option.id}
                                        onChange={() => set("timeline", option.id)}
                                      />
                                      {option.label}
                                    </label>
                                  ))}
                                </div>
                                {errors.timeline ? (
                                  <p role="alert" className="mt-3 flex items-center gap-1.5 text-[14px] text-accent-bright">
                                    <WarningCircle size={15} weight="fill" />
                                    {errors.timeline}
                                  </p>
                                ) : null}
                              </fieldset>
                            </div>
                          ) : null}

                          {step === 3 ? (
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div>
                                <label htmlFor={`${uid}-name`} className="block text-[14px] font-medium text-text">
                                  {copy.nameLabel}
                                </label>
                                <input
                                  id={`${uid}-name`}
                                  value={values.name}
                                  autoComplete="name"
                                  onChange={(event) => set("name", event.target.value)}
                                  onBlur={() => {
                                    if (values.name.trim().length < 2) {
                                      setErrors((c) => ({ ...c, name: copy.required }));
                                    }
                                  }}
                                  aria-invalid={Boolean(errors.name)}
                                  aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                                  className={`mt-2 ${fieldClass}`}
                                />
                                {errors.name ? (
                                  <p id={`${uid}-name-error`} role="alert" className="mt-2 text-[14px] text-accent-bright">
                                    {errors.name}
                                  </p>
                                ) : null}
                              </div>

                              <div>
                                <label htmlFor={`${uid}-email`} className="block text-[14px] font-medium text-text">
                                  {copy.emailLabel}
                                </label>
                                <input
                                  id={`${uid}-email`}
                                  type="email"
                                  inputMode="email"
                                  autoComplete="email"
                                  value={values.email}
                                  onChange={(event) => set("email", event.target.value)}
                                  onBlur={() => {
                                    if (
                                      values.email.trim() &&
                                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
                                    ) {
                                      setErrors((c) => ({ ...c, email: copy.invalidEmail }));
                                    }
                                  }}
                                  aria-invalid={Boolean(errors.email)}
                                  aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                                  className={`mt-2 ${fieldClass}`}
                                />
                                {errors.email ? (
                                  <p id={`${uid}-email-error`} role="alert" className="mt-2 text-[14px] text-accent-bright">
                                    {errors.email}
                                  </p>
                                ) : null}
                              </div>

                              <div>
                                <label htmlFor={`${uid}-company`} className="block text-[14px] font-medium text-text">
                                  {copy.companyLabel}{" "}
                                  <span className="text-text-faint">({copy.optional})</span>
                                </label>
                                <input
                                  id={`${uid}-company`}
                                  autoComplete="organization"
                                  value={values.company}
                                  onChange={(event) => set("company", event.target.value)}
                                  className={`mt-2 ${fieldClass}`}
                                />
                              </div>

                              <div>
                                <label htmlFor={`${uid}-phone`} className="block text-[14px] font-medium text-text">
                                  {copy.phoneLabel}{" "}
                                  <span className="text-text-faint">({copy.optional})</span>
                                </label>
                                <input
                                  id={`${uid}-phone`}
                                  type="tel"
                                  inputMode="tel"
                                  autoComplete="tel"
                                  value={values.phone}
                                  onChange={(event) => set("phone", event.target.value)}
                                  className={`mt-2 ${fieldClass}`}
                                />
                              </div>
                            </div>
                          ) : null}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Honeypot, hidden from people and from assistive tech. */}
                    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                      <label htmlFor={`${uid}-website`}>Website</label>
                      <input
                        id={`${uid}-website`}
                        tabIndex={-1}
                        autoComplete="off"
                        value={values.website}
                        onChange={(event) => set("website", event.target.value)}
                      />
                    </div>

                    {status === "error" ? (
                      <p role="alert" className="mt-5 rounded-[var(--radius-md)] border border-hairline-strong px-4 py-3 text-[14px] text-text">
                        <span className="font-medium">{copy.errorTitle}.</span>{" "}
                        <span className="text-text-muted">{copy.errorBody}</span>
                      </p>
                    ) : null}

                    <div className="mt-8 flex items-center gap-3 border-t border-hairline pt-6">
                      {step > 0 ? (
                        <button
                          type="button"
                          onClick={goBack}
                          className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-hairline-strong px-4 py-3 text-[15px] text-text transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-canvas-raised active:scale-[0.97]"
                        >
                          <ArrowLeft size={16} />
                          {copy.back}
                        </button>
                      ) : null}

                      {step < TOTAL_STEPS - 1 ? (
                        <button
                          type="button"
                          onClick={goNext}
                          className="ml-auto inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-text px-5 py-3 text-[15px] font-medium text-canvas-deep transition-[transform,opacity] duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
                        >
                          {copy.next}
                          <ArrowRight size={16} weight="bold" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="ml-auto inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent px-5 py-3 text-[15px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-accent-bright active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {status === "sending" ? copy.sending : copy.submit}
                          <ArrowRight size={16} weight="bold" />
                        </button>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
