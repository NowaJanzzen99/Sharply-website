"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle, PencilSimple } from "@phosphor-icons/react";
import { Reveal, RevealLines, splitHeading } from "./Reveal";
import { FieldControl } from "./contact/FieldControl";
import {
  buildSections,
  groupsForStep,
  validateField,
  validateStep,
  type Values,
} from "./contact/form-model";
import { isAllowedFile, MAX_FILES, MAX_TOTAL_BYTES } from "@/lib/contact-schema";
import type { Content, Field, Lang } from "@/content";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({ content, lang }: { content: Content; lang: Lang }) {
  const copy = content.contact;
  const uid = useId();
  const panel = useRef<HTMLDivElement>(null);
  const total = copy.steps.length;
  const last = total - 1;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const current = copy.steps[step];
  const sections = buildSections(copy, values);
  const filesLabel = copy.steps
    .flatMap((formStep) => formStep.fields)
    .find((field) => field.kind === "files")?.label;

  function setValue(id: string, value: string | string[]) {
    setValues((existing) => ({ ...existing, [id]: value }));
    setErrors((existing) => {
      if (!existing[id]) return existing;
      const next = { ...existing };
      delete next[id];
      return next;
    });
  }

  function checkOnBlur(field: Field) {
    const raw = values[field.id];
    const error = validateField(field, raw, copy);
    setErrors((existing) => {
      const next = { ...existing };
      // Only nag about a field once something has been typed into it.
      if (error && raw && String(raw).trim()) next[field.id] = error;
      else delete next[field.id];
      return next;
    });
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);

    if (incoming.some((file) => !isAllowedFile(file.name))) {
      setFileError(copy.filesType);
      return;
    }

    const merged = [...files, ...incoming];
    if (merged.length > MAX_FILES) {
      setFileError(copy.filesTooMany);
      return;
    }
    if (merged.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
      setFileError(copy.filesTooBig);
      return;
    }

    setFileError(undefined);
    setFiles(merged);
  }

  function removeFile(index: number) {
    setFiles((existing) => existing.filter((_, position) => position !== index));
    setFileError(undefined);
  }

  /** Keep the top of the panel in view so a new step never starts scrolled away. */
  function keepPanelInView() {
    requestAnimationFrame(() => {
      const element = panel.current;
      if (!element) return;
      if (element.getBoundingClientRect().top < 84) {
        element.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    });
  }

  function scrollToFirstError() {
    requestAnimationFrame(() => {
      panel.current
        ?.querySelector("[data-field-error]")
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function goTo(index: number, travel: number) {
    setDirection(travel);
    setStep(index);
    keepPanelInView();
  }

  function goNext() {
    const found = validateStep(copy, step, values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      scrollToFirstError();
      return;
    }
    goTo(Math.min(step + 1, last), 1);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step !== last) return;

    // Run every earlier step again, so nothing required can slip past the review.
    for (let index = 0; index < last; index += 1) {
      const found = validateStep(copy, index, values);
      if (Object.keys(found).length > 0) {
        setErrors(found);
        goTo(index, -1);
        scrollToFirstError();
        return;
      }
    }

    setStatus("sending");

    const payload = {
      lang,
      name: String(values["contact.name"] ?? ""),
      email: String(values["contact.email"] ?? ""),
      company: String(values["about.company"] ?? ""),
      consent: true,
      website: honeypot,
      sections: sections.map(({ title, rows }) => ({ title, rows })),
    };

    const body = new FormData();
    body.append("payload", JSON.stringify(payload));
    files.forEach((file) => body.append("files", file));

    try {
      const response = await fetch("/api/contact", { method: "POST", body });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  function restart() {
    setValues({});
    setErrors({});
    setFiles([]);
    setFileError(undefined);
    setStep(0);
    setStatus("idle");
  }

  const enter = { opacity: 0, transform: `translateX(${direction * 28}px)` };
  const exit = { opacity: 0, transform: `translateX(${direction * -28}px)` };
  const groups = groupsForStep(copy, step, values);

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-hairline py-28 md:py-40"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <Image
          src="/images/bg-iridescent.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
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
          </div>

          <Reveal className="lg:col-span-8" delay={0.08}>
            <div
              ref={panel}
              className="glass scroll-mt-24 rounded-[var(--radius-lg)] p-5 sm:p-7 md:p-9"
            >
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
                    {/* Step rail: completed steps can be revisited. */}
                    <ol className="flex items-center gap-1.5">
                      {copy.steps.map((formStep, index) => {
                        const done = index < step;
                        const active = index === step;
                        return (
                          <li
                            key={formStep.id}
                            className="flex min-w-0 flex-1 items-center gap-1.5 last:flex-none"
                          >
                            <button
                              type="button"
                              disabled={!done}
                              onClick={() => goTo(index, -1)}
                              aria-label={formStep.title}
                              aria-current={active ? "step" : undefined}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border font-mono text-[11px] transition-[background-color,border-color,color] duration-300 ease-[var(--ease-out)] disabled:cursor-default"
                              style={{
                                borderColor:
                                  done || active ? "var(--accent)" : "var(--hairline-strong)",
                                backgroundColor: done ? "var(--accent)" : "transparent",
                                color: done
                                  ? "var(--accent-ink)"
                                  : active
                                    ? "var(--accent-bright)"
                                    : "var(--text-faint)",
                              }}
                            >
                              {done ? <Check size={12} weight="bold" /> : index + 1}
                            </button>
                            {index < last ? (
                              <span
                                aria-hidden="true"
                                className="h-px flex-1 overflow-hidden bg-hairline-strong"
                              >
                                <span
                                  className="block h-full w-full origin-left bg-accent transition-transform duration-500 ease-[var(--ease-out)]"
                                  style={{ transform: `scaleX(${done ? 1 : 0})` }}
                                />
                              </span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ol>

                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-text-faint">
                      {copy.progress
                        .replace("{current}", String(step + 1))
                        .replace("{total}", String(total))}
                    </p>
                    <h3 className="mt-2 font-display text-[24px] font-medium text-text md:text-[28px]">
                      {current.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] text-text-faint">{current.hint}</p>

                    <div className="mt-8">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={step}
                          initial={enter}
                          animate={{ opacity: 1, transform: "translateX(0px)" }}
                          exit={exit}
                          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                          className="flex flex-col gap-9"
                        >
                          {current.id === "review" ? (
                            <div className="flex flex-col gap-7">
                              <p className="text-[15px] leading-[1.6] text-text-muted">
                                {copy.reviewIntro}
                              </p>

                              {sections.map((section) => (
                                <div key={`${section.title}-${section.stepIndex}`}>
                                  <div className="flex items-center justify-between gap-4 border-b border-hairline pb-2">
                                    <h4 className="font-display text-[17px] font-medium text-text">
                                      {section.title}
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() => goTo(section.stepIndex, -1)}
                                      className="inline-flex items-center gap-1.5 text-[13px] text-text-muted transition-colors duration-150 ease-out hover:text-text"
                                    >
                                      <PencilSimple size={13} />
                                      {copy.edit}
                                    </button>
                                  </div>
                                  <dl className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-[minmax(0,11rem)_1fr]">
                                    {section.rows.map((row) => (
                                      <div key={row.label} className="contents">
                                        <dt className="text-[13px] text-text-faint">{row.label}</dt>
                                        <dd className="whitespace-pre-wrap text-[15px] text-text">
                                          {row.value}
                                        </dd>
                                      </div>
                                    ))}
                                  </dl>
                                </div>
                              ))}

                              {files.length > 0 ? (
                                <div>
                                  <h4 className="border-b border-hairline pb-2 font-display text-[17px] font-medium text-text">
                                    {filesLabel}
                                  </h4>
                                  <p className="mt-3 text-[15px] text-text">
                                    {files.map((file) => file.name).join(", ")}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          ) : groups.length === 0 ? (
                            <p className="text-[15px] leading-[1.6] text-text-muted">
                              {copy.noDetails}
                            </p>
                          ) : (
                            groups.map((group) => (
                              <div key={group.title ?? current.id}>
                                {group.title ? (
                                  <h4 className="mb-5 border-b border-hairline pb-2 font-display text-[18px] font-medium text-text">
                                    {group.title}
                                  </h4>
                                ) : null}
                                <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">
                                  {group.fields.map((field) => (
                                    <div
                                      key={field.id}
                                      className={field.half ? "" : "sm:col-span-2"}
                                    >
                                      <FieldControl
                                        field={field}
                                        value={values[field.id]}
                                        error={errors[field.id]}
                                        copy={copy}
                                        uid={uid}
                                        onChange={setValue}
                                        onBlurCheck={checkOnBlur}
                                        files={files}
                                        fileError={fileError}
                                        onFiles={addFiles}
                                        onRemoveFile={removeFile}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Honeypot, hidden from people and from assistive tech. */}
                    <div
                      aria-hidden="true"
                      className="absolute left-[-9999px] h-px w-px overflow-hidden"
                    >
                      <label htmlFor={`${uid}-website`}>Website</label>
                      <input
                        id={`${uid}-website`}
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                      />
                    </div>

                    {status === "error" ? (
                      <p
                        role="alert"
                        className="mt-6 rounded-[var(--radius-md)] border border-hairline-strong px-4 py-3 text-[14px] text-text"
                      >
                        <span className="font-medium">{copy.errorTitle}.</span>{" "}
                        <span className="text-text-muted">{copy.errorBody}</span>
                      </p>
                    ) : null}

                    <div className="mt-9 flex items-center gap-3 border-t border-hairline pt-6">
                      {step > 0 ? (
                        <button
                          type="button"
                          onClick={() => goTo(step - 1, -1)}
                          className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-hairline-strong px-4 py-3 text-[15px] text-text transition-[transform,background-color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:bg-canvas-raised"
                        >
                          <ArrowLeft size={16} />
                          {copy.back}
                        </button>
                      ) : null}

                      {step < last ? (
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
                          className="ml-auto inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent px-5 py-3 text-[15px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70 hover-fine:hover:bg-accent-bright"
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
