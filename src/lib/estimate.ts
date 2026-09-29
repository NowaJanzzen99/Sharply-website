import type { Values } from "@/components/contact/form-model";

/*
  A price indication, built from what someone filled in.

  Why a range and never a number: the same answers can still mean two different
  projects, and a single figure would read as a quote. A range with the reasons
  beside it is honest, and it lets someone see for themselves which of their
  own choices is the expensive one.

  ALL AMOUNTS ARE IN EUROS AND ARE NOAH'S TO SET. They are the only thing in
  this file that is a business decision rather than arithmetic, so they all sit
  in the tables below, and nowhere else. The starting points follow the budget
  brackets already used in the form (under 5k, 5 to 15k, 15 to 40k, above), so
  a small site lands in the first bracket and a shop with a login in the third.
*/

type Band = [low: number, high: number];

const add = (a: Band, b: Band): Band => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Band, f: number): Band => [a[0] * f, a[1] * f];

/** What a service costs before any of its own answers are taken into account. */
const BASE: Record<string, Band> = {
  website: [2400, 4800],
  webshop: [4500, 9000],
  "ai-chat": [1800, 3800],
  automation: [1500, 3500],
  branding: [1400, 3200],
  motion: [900, 2400],
  "ai-content": [700, 1800],
  other: [0, 0],
};

/** What each answer inside a service adds. Anything not named here adds nothing. */
const EXTRA: Record<string, Record<string, Band>> = {
  "website.pages": {
    "1-5": [0, 0],
    "6-15": [1200, 2200],
    "16-40": [3000, 5500],
    "40+": [6000, 12000],
  },
  "website.features": {
    account: [1500, 3200],
    booking: [900, 1900],
    crm: [700, 1500],
    search: [500, 1100],
    blog: [400, 900],
    cases: [400, 900],
    forms: [300, 700],
    animation: [600, 1500],
  },
  "website.editing": {
    // The assistant that lets you keep changing the site by asking for it.
    talk: [900, 1800],
  },
  "webshop.products": {
    "lt-25": [0, 0],
    "25-250": [800, 1600],
    "250-2500": [2200, 4500],
    "2500+": [5000, 11000],
  },
  "webshop.shipping": { eu: [300, 700], world: [600, 1200] },
  "ai-chat.jobs": {
    booking: [700, 1500],
    orders: [700, 1500],
    knowledge: [600, 1200],
    leads: [400, 900],
  },
  "branding.deliverables": {
    guidelines: [700, 1500],
    packaging: [600, 1400],
    signage: [600, 1400],
    templates: [450, 1000],
    colour: [350, 800],
    logo: [0, 0],
  },
  "motion.amount": { one: [0, 0], few: [700, 1800], series: [2200, 5500] },
  "ai-content.volume": {
    "lt-10": [0, 0],
    "10-50": [600, 1400],
    "50+": [1800, 4200],
    ongoing: [1800, 4200],
  },
};

/** Answers where every extra choice costs the same again. */
const PER_ITEM: Record<string, { free: number; each: Band }> = {
  "website.languages": { free: 1, each: [450, 900] },
  "webshop.payments": { free: 1, each: [150, 350] },
  "ai-chat.channels": { free: 1, each: [500, 1100] },
  "automation.tools": { free: 0, each: [450, 950] },
};

/** Wanting it soon costs more, because it pushes other work aside. */
const RUSH = 1.12;

/** Looking after it afterwards, per month. */
const CARE: Band = [150, 450];

export type Estimate = {
  low: number;
  high: number;
  /** Set when the visitor asked us to keep looking after it. */
  monthly?: Band;
  /** The choices that moved the number, in the order they were asked. */
  drivers: string[];
  /** True when something was picked that cannot be priced from a form. */
  open: boolean;
};

const list = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];

/** Labels for the drivers, looked up from the form's own options. */
type Labeller = (fieldId: string, optionId: string) => string | undefined;

export function estimate(values: Values, label: Labeller): Estimate | null {
  const needs = list(values["needs.needs"]);
  if (needs.length === 0) return null;

  let band: Band = [0, 0];
  const drivers: string[] = [];
  let open = false;

  needs.forEach((need) => {
    const base = BASE[need];
    if (!base) return;
    if (need === "other") {
      open = true;
      return;
    }
    band = add(band, base);
  });

  Object.entries(EXTRA).forEach(([fieldId, table]) => {
    list(values[fieldId]).forEach((choice) => {
      const amount = table[choice];
      if (!amount || (amount[0] === 0 && amount[1] === 0)) return;
      band = add(band, amount);
      const name = label(fieldId, choice);
      if (name) drivers.push(name);
    });
  });

  Object.entries(PER_ITEM).forEach(([fieldId, rule]) => {
    const extra = Math.max(0, list(values[fieldId]).length - rule.free);
    if (extra === 0) return;
    band = add(band, scale(rule.each, extra));
    const names = list(values[fieldId])
      .slice(rule.free)
      .map((choice) => label(fieldId, choice))
      .filter(Boolean);
    if (names.length) drivers.push(names.join(", "));
  });

  if (band[1] === 0) return null;

  const rushed = values["plan.timeline"] === "asap";
  if (rushed) band = scale(band, RUSH);

  // To the nearest hundred, so it reads as an indication and not as a quote.
  const round = (n: number) => Math.round(n / 100) * 100;

  return {
    low: round(band[0]),
    high: round(band[1]),
    monthly: values["plan.maintenance"] === "studio" ? CARE : undefined,
    drivers: drivers.slice(0, 6),
    open,
  };
}

export function formatEuro(amount: number, lang: string): string {
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : "nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
