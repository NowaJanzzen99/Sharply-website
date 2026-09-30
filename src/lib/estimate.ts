import type { Values } from "@/components/contact/form-model";

/*
  A price indication, built from what someone filled in.

  Why a range and never a number: the same answers can still mean two different
  projects, and a single figure would read as a quote. A range with the reasons
  beside it is honest, and it lets someone see for themselves which of their
  own choices is the expensive one.

  ALL AMOUNTS ARE IN EUROS, EXCLUDING VAT, AND ARE NOAH'S TO SET. They are the
  only thing in this file that is a business decision rather than arithmetic,
  so they all sit in the tables below and nowhere else.

  They are calibrated to the packages on the site (see `pricing` in the content
  files), so what the form says and what the price section says agree:

    Start      3.500   up to 5 pages, one language
    Studio     6.500   up to 12 pages, two languages, animation, booking
    Signature  11.500  and up: accounts, integrations, custom interaction

  The reasoning for these figures, and the market data behind them, is in
  BRIEF.md under "Prijzen". The short version: the price follows the proof, and
  with one real client and two concepts the honest ceiling is the upper end of
  the small studio band, not an agency rate.
*/

type Band = [low: number, high: number];

const add = (a: Band, b: Band): Band => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Band, f: number): Band => [a[0] * f, a[1] * f];

/** What a service costs before any of its own answers are taken into account. */
const BASE: Record<string, Band> = {
  website: [3500, 4900],
  webshop: [9000, 13500],
  "ai-chat": [3500, 5500],
  automation: [2000, 4500],
  branding: [2500, 4000],
  motion: [1200, 3000],
  "ai-content": [900, 2200],
  other: [0, 0],
};

/** What each answer inside a service adds. Anything not named here adds nothing. */
const EXTRA: Record<string, Record<string, Band>> = {
  "website.pages": {
    "1-5": [0, 0],
    "6-15": [1200, 1800],
    "16-40": [3200, 5000],
    "40+": [7000, 12000],
  },
  "website.features": {
    account: [2200, 3600],
    booking: [900, 1500],
    crm: [800, 1400],
    search: [400, 900],
    blog: [300, 700],
    cases: [300, 700],
    forms: [200, 500],
    animation: [500, 1200],
  },
  "website.editing": {
    // Setting up the assistant that lets you keep changing the site by asking.
    talk: [800, 1500],
  },
  "webshop.products": {
    "lt-25": [0, 0],
    "25-250": [1000, 2000],
    "250-2500": [3000, 6000],
    "2500+": [7000, 14000],
  },
  "webshop.shipping": { eu: [400, 900], world: [800, 1500] },
  "ai-chat.jobs": {
    booking: [900, 1800],
    orders: [900, 1800],
    knowledge: [800, 1500],
    leads: [500, 1100],
  },
  "branding.deliverables": {
    guidelines: [900, 1800],
    packaging: [800, 1800],
    signage: [800, 1800],
    templates: [600, 1300],
    colour: [400, 900],
    logo: [0, 0],
  },
  "motion.amount": { one: [0, 0], few: [900, 2200], series: [2800, 6500] },
  "ai-content.volume": {
    "lt-10": [0, 0],
    "10-50": [700, 1600],
    "50+": [2200, 5000],
    ongoing: [2200, 5000],
  },
};

/** Answers where every extra choice costs the same again. */
const PER_ITEM: Record<string, { free: number; each: Band }> = {
  "website.languages": { free: 1, each: [400, 700] },
  "webshop.payments": { free: 1, each: [200, 400] },
  "ai-chat.channels": { free: 1, each: [600, 1300] },
  "automation.tools": { free: 0, each: [600, 1200] },
};

/** Wanting it soon costs more, because it pushes other work aside. */
const RUSH = 1.12;

/**
 * Looking after it afterwards, per month. Every plan includes hosting, updates
 * and the assistant the client changes the site with.
 */
export type Plan = "basis" | "groei" | "volledig";
const PLAN_PRICE: Record<Plan, number> = { basis: 99, groei: 199, volledig: 399 };

/** Which plan fits what was asked for. Bigger things need more looking after. */
function planFor(needs: string[], values: Values): Plan {
  const features = list(values["website.features"]);
  if (needs.includes("webshop") || features.includes("account") || needs.length >= 3) {
    return "volledig";
  }
  const pages = String(values["website.pages"] ?? "");
  if (
    needs.includes("ai-chat") ||
    needs.includes("automation") ||
    values["website.editing"] === "talk" ||
    ["6-15", "16-40", "40+"].includes(pages)
  ) {
    return "groei";
  }
  return "basis";
}

export type Estimate = {
  low: number;
  high: number;
  /** Set when the visitor asked us to keep looking after it. */
  monthly?: { plan: Plan; price: number };
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

  // To the nearest fifty, so it reads as an indication and not as a quote.
  const round = (n: number) => Math.round(n / 50) * 50;

  const wantsCare = values["plan.maintenance"] === "studio" || values["website.editing"] === "talk";
  const plan = planFor(needs, values);

  return {
    low: round(band[0]),
    high: round(band[1]),
    monthly: wantsCare ? { plan, price: PLAN_PRICE[plan] } : undefined,
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
