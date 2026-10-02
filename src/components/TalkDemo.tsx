"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Globe,
  RocketLaunch,
  ShoppingBag,
  Sun,
  TextAa,
  type Icon,
} from "@phosphor-icons/react";
import { Reveal, RevealLines, splitHeading } from "./Reveal";
import Image from "next/image";
import type { Content, DemoCommand } from "@/content";

type PreviewState = {
  bigHeadline: boolean;
  light: boolean;
  shop: boolean;
};

type Entry = { id: number; ask: string; reply: string };

const INITIAL: PreviewState = { bigHeadline: false, light: false, shop: false };

/** One picture per instruction, so each button reads as an action at a glance. */
const ICONS: Record<DemoCommand["id"], Icon> = {
  headline: TextAa,
  light: Sun,
  shop: ShoppingBag,
  publish: RocketLaunch,
};

/** Loose keyword match so typed instructions land on the same four scripted actions. */
const MATCHERS: Record<DemoCommand["id"], RegExp> = {
  headline: /(kop|titel|headline|groter|bigger|larger|heading)/i,
  light: /(licht|light|wit|white|helder|thema|theme|dark)/i,
  shop: /(shop|winkel|webshop|verkoop|sell|store|product)/i,
  publish: /(publiceer|publish|live|online|deploy)/i,
};

export function TalkDemo({ content }: { content: Content }) {
  const [state, setState] = useState<PreviewState>(INITIAL);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [typed, setTyped] = useState("");
  const [stage, setStage] = useState<"idle" | "publishing" | "live">("idle");
  const counter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const runRef = useRef<((command: DemoCommand) => void) | null>(null);
  const reduce = useReducedMotion();
  // Until someone clicks, the first instruction pulses: an invitation, not a hint to read.
  const [tried, setTried] = useState(false);
  // Bumped on every change, so the preview frame flashes where the change happened.
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
    };
  }, []);

  /*
    On arrival the demo plays one instruction by itself, typing it out first.
    Purpose is explanation: reading "the site adapts" convinces nobody, watching
    the headline grow does. It runs once, and any interaction cancels it.

    Its timers live in this effect rather than in the shared list, so the
    component's own cleanup cannot clear them out from under it.
  */
  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const own: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const demo = content.demo.commands[0];
        const letters = demo.label.split("");

        letters.forEach((_, position) => {
          own.push(
            setTimeout(
              () => {
                if (touched.current) return;
                setTyped(demo.label.slice(0, position + 1));
              },
              900 + position * 42,
            ),
          );
        });

        own.push(
          setTimeout(
            () => {
              if (touched.current) return;
              setTyped("");
              runRef.current?.(demo);
            },
            900 + letters.length * 42 + 500,
          ),
        );
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      own.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    On a phone the controls and the preview do not fit on one screen, so a tap
    could change something the reader cannot see. After a deliberate tap the
    preview is brought back into view if any of it is off screen.
  */
  function revealPreview() {
    const element = preview.current;
    if (!element || window.matchMedia("(min-width: 1024px)").matches) return;

    requestAnimationFrame(() => {
      const box = element.getBoundingClientRect();
      const margin = 84;
      if (box.top >= margin && box.bottom <= window.innerHeight - 24) return;
      element.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  }

  function log(ask: string, reply: string) {
    counter.current += 1;
    const entry = { id: counter.current, ask, reply };
    setEntries((current) => [entry, ...current].slice(0, 3));
  }

  function run(command: DemoCommand) {
    if (command.id === "publish") {
      setStage("publishing");
      const timer = setTimeout(() => setStage("live"), reduce ? 200 : 1400);
      timers.current.push(timer);
    } else {
      setStage("idle");
      setState((current) => ({
        bigHeadline:
          command.id === "headline" ? !current.bigHeadline : current.bigHeadline,
        light: command.id === "light" ? !current.light : current.light,
        shop: command.id === "shop" ? !current.shop : current.shop,
      }));
    }
    log(command.label, command.reply);
    setFlash((value) => value + 1);
  }

  useEffect(() => {
    runRef.current = run;
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = typed.trim();
    if (!value) return;

    const match = content.demo.commands.find((command) =>
      MATCHERS[command.id].test(value),
    );

    if (match) {
      run({ ...match, label: value });
    } else {
      log(value, content.demo.unknownReply);
    }
    setTyped("");
    revealPreview();
  }

  function reset() {
    setState(INITIAL);
    setEntries([]);
    setStage("idle");
  }

  const previewCopy = content.demo.preview;

  return (
    <section
      id="demo"
      className="relative scroll-mt-24 overflow-hidden border-t border-hairline py-28 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] opacity-50"
      >
        <Image
          src="/images/bg-horizon.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="container-page">
        <div className="max-w-[56ch]">
          <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
            <RevealLines lines={splitHeading(content.demo.title)} onView />
          </h2>
          <Reveal delay={0.06}>
            <p className="mt-5 text-[17px] leading-[1.6] text-text-muted md:text-[19px]">
              {content.demo.lead}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Controls */}
          <Reveal className="order-2 lg:order-1 lg:col-span-5">
            <div ref={panel} data-scene="panel" data-scene-variant="left" className="glass rounded-[var(--radius-lg)] p-5 md:p-6">
              <p className="flex items-center gap-2 text-[13px] font-medium text-accent-bright">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
                </span>
                {content.demo.badge}
              </p>
              <p className="mt-3 font-display text-[22px] font-medium text-text">
                {content.demo.tryTitle}
              </p>
              <p className="mt-1.5 mb-5 text-[15px] leading-[1.5] text-text-muted">
                {content.demo.tryHint}
              </p>

              {/*
                Real buttons, not tags: a raised face with a lit top edge and a
                shadow under it, an icon tile, and an arrow that says "do this".
                Pressed, they light up and carry a check, so the four double as a
                read-out of what the preview currently has switched on.
              */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                {content.demo.commands.map((command, index) => {
                  const CommandIcon = ICONS[command.id];
                  const on =
                    command.id === "headline"
                      ? state.bigHeadline
                      : command.id === "light"
                        ? state.light
                        : command.id === "shop"
                          ? state.shop
                          : stage === "live";
                  return (
                    <button
                      key={command.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        touched.current = true;
                        setTried(true);
                        run(command);
                        revealPreview();
                      }}
                      className={`group/cmd relative flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2.5 text-left text-[15px] font-medium text-text shadow-[inset_0_1px_0_oklch(0.98_0.01_264/0.14),0_8px_18px_oklch(0.05_0.02_264/0.55)] transition-[transform,border-color,background-color,box-shadow] duration-150 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-px active:scale-[0.98] active:shadow-[inset_0_1px_0_oklch(0.98_0.01_264/0.08),0_2px_6px_oklch(0.05_0.02_264/0.5)] hover-fine:hover:-translate-y-px hover-fine:hover:border-accent ${
                        on
                          ? "border-accent bg-[linear-gradient(180deg,oklch(0.36_0.11_259),oklch(0.27_0.09_261))]"
                          : "border-hairline-strong bg-[linear-gradient(180deg,oklch(0.26_0.035_264),oklch(0.2_0.03_264))]"
                      }`}
                    >
                      {!tried && index === 0 ? (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-[3px] animate-pulse rounded-[calc(var(--radius-md)+3px)] ring-2 ring-accent motion-reduce:hidden"
                        />
                      ) : null}
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] ${
                          on ? "bg-accent text-accent-ink" : "bg-accent/15 text-accent-bright"
                        }`}
                      >
                        <CommandIcon size={17} weight="bold" />
                      </span>
                      <span className="flex-1 leading-[1.25]">{command.label}</span>
                      <span aria-hidden="true" className="shrink-0 text-text-muted">
                        {on ? (
                          <Check size={16} weight="bold" className="text-accent-bright" />
                        ) : (
                          <ArrowRight
                            size={16}
                            weight="bold"
                            className="transition-transform duration-200 ease-[var(--ease-out)] group-hover/cmd:translate-x-0.5"
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={submit} className="mt-5">
                <label
                  htmlFor="demo-input"
                  className="block text-[13px] font-medium text-text-faint"
                >
                  {content.demo.inputLabel}
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="demo-input"
                    value={typed}
                    onChange={(event) => {
                      touched.current = true;
                      setTried(true);
                      setTyped(event.target.value);
                    }}
                    placeholder={content.demo.inputPlaceholder}
                    className="min-w-0 flex-1 rounded-[var(--radius-md)] border border-hairline-strong bg-canvas-deep px-3.5 py-2.5 text-[15px] text-text placeholder:text-text-faint"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[15px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-accent-bright active:scale-[0.97]"
                  >
                    {content.demo.send}
                    <ArrowRight size={16} weight="bold" />
                  </button>
                </div>
              </form>

              <div className="mt-5" aria-live="polite">
                {entries.length > 0 ? (
                  <p className="text-[13px] font-medium text-text-faint">
                    {content.demo.transcriptLabel}
                  </p>
                ) : null}
                <ul className="mt-2 flex flex-col gap-2">
                  <AnimatePresence initial={false}>
                    {entries.map((entry) => (
                      <motion.li
                        key={entry.id}
                        initial={{ opacity: 0, transform: "translateY(-8px)" }}
                        animate={{ opacity: 1, transform: "translateY(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="rounded-[var(--radius-md)] border border-hairline px-3.5 py-2.5"
                      >
                        <p className="text-[14px] text-text">{entry.ask}</p>
                        <p className="mt-1 text-[13px] text-text-faint">
                          {entry.reply}
                        </p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-hairline pt-4">
                <p className="text-[13px] leading-[1.5] text-text-faint">
                  {content.demo.note}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="shrink-0 text-[13px] text-text-muted underline underline-offset-4 transition-colors duration-200 ease-out hover:text-text"
                >
                  {content.demo.reset}
                </button>
              </div>
            </div>
          </Reveal>

          {/* Live preview */}
          <Reveal className="order-1 lg:order-2 lg:col-span-7" delay={0.1}>
            <p className="mb-3 flex items-center gap-2 text-[14px] text-text-muted">
              <ArrowLeft size={15} weight="bold" aria-hidden="true" className="hidden text-accent-bright lg:block" />
              {content.demo.previewLabel}
            </p>
            <div ref={preview} data-scene="panel" data-scene-variant="right" data-scene-lag={0.1} className="glass scroll-mt-24 rounded-[var(--radius-lg)] p-2.5">
              <div className="relative overflow-hidden rounded-[calc(var(--radius-lg)-6px)] border border-hairline bg-canvas-deep">
              {flash > 0 ? (
                <motion.span
                  key={flash}
                  aria-hidden="true"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-2 border-accent-bright"
                />
              ) : null}
              <div className="flex items-center gap-2 border-b border-hairline bg-[oklch(0.16_0.028_264/0.6)] px-4 py-3">
                <Globe size={15} className="shrink-0 text-text-faint" />
                <span className="truncate font-mono text-[12px] text-text-faint">
                  {stage === "live"
                    ? content.demo.deploy.url
                    : content.demo.unpublishedNote}
                </span>
                <AnimatePresence>
                  {stage === "live" ? (
                    <motion.span
                      initial={{ opacity: 0, transform: "scale(0.94)" }}
                      animate={{ opacity: 1, transform: "scale(1)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="ml-auto flex items-center gap-1.5 text-[12px] text-accent-bright"
                    >
                      <CheckCircle size={14} weight="fill" />
                      {content.demo.deploy.live}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="relative">
                <motion.div
                  animate={{
                    backgroundColor: state.light
                      ? "oklch(0.97 0.006 264)"
                      : "oklch(0.11 0.024 264)",
                  }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="p-7 md:p-10"
                >
                  <motion.p
                    animate={{ opacity: state.light ? 0.6 : 0.55 }}
                    className={`font-mono text-[12px] uppercase tracking-[0.12em] ${
                      state.light ? "text-[#1a1a1f]" : "text-white"
                    }`}
                  >
                    {previewCopy.brand}
                  </motion.p>

                  <motion.h3
                    animate={{
                      transform: state.bigHeadline ? "scale(1.28)" : "scale(1)",
                    }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className={`mt-5 max-w-[16ch] origin-top-left font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[32px] ${
                      state.light ? "text-[#121216]" : "text-white"
                    }`}
                  >
                    {previewCopy.headline}
                  </motion.h3>

                  <motion.p
                    animate={{ marginTop: state.bigHeadline ? 34 : 18 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className={`max-w-[42ch] text-[15px] leading-[1.6] ${
                      state.light ? "text-[#4a4a55]" : "text-white/65"
                    }`}
                  >
                    {previewCopy.body}
                  </motion.p>

                  <div
                    className={`mt-6 inline-flex rounded-[var(--radius-pill)] px-4 py-2.5 text-[14px] font-medium transition-colors duration-300 ease-[var(--ease-out)] ${
                      state.light
                        ? "bg-[#121216] text-white"
                        : "bg-white text-[#121216]"
                    }`}
                  >
                    {previewCopy.cta}
                  </div>

                  <AnimatePresence initial={false}>
                    {state.shop ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0, transform: "translateY(12px)" }}
                        animate={{ opacity: 1, height: "auto", transform: "translateY(0px)" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`mt-8 border-t pt-6 ${
                            state.light ? "border-[#121216]/12" : "border-white/12"
                          }`}
                        >
                          <p
                            className={`font-mono text-[12px] uppercase tracking-[0.12em] ${
                              state.light ? "text-[#4a4a55]" : "text-white/55"
                            }`}
                          >
                            {previewCopy.shopTitle}
                          </p>
                          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                            {previewCopy.shopItems.map((item) => (
                              <li
                                key={item.name}
                                className={`rounded-[var(--radius-md)] border p-3.5 ${
                                  state.light
                                    ? "border-[#121216]/12"
                                    : "border-white/12"
                                }`}
                              >
                                <span
                                  className={`block text-[14px] ${
                                    state.light ? "text-[#121216]" : "text-white"
                                  }`}
                                >
                                  {item.name}
                                </span>
                                <span
                                  className={`mt-1 block font-mono text-[13px] ${
                                    state.light ? "text-[#4a4a55]" : "text-white/60"
                                  }`}
                                >
                                  &euro; {item.price}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                  {stage === "publishing" ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute inset-0 flex items-center justify-center bg-canvas-deep/80 backdrop-blur-sm"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-[14px] text-text">
                          {content.demo.deploy.building}
                        </span>
                        <span className="h-[3px] w-40 overflow-hidden rounded-[var(--radius-pill)] bg-hairline-strong">
                          <motion.span
                            className="block h-full w-full origin-left bg-accent"
                            initial={{ transform: "scaleX(0)" }}
                            animate={{ transform: "scaleX(1)" }}
                            transition={{ duration: reduce ? 0.2 : 1.3, ease: "linear" }}
                          />
                        </span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
