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
    // A single page is the smallest custom build: it is priced as a cut from
    // the base website, not as an extra. See the "one page" handling below.
    "1": [-1700, -2300],
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

/**
 * One thing in the package, with what it adds. Every line can be taken out,
 * which is the point: someone with less to spend should be able to see which
 * of their own choices costs what, and drop them one by one.
 */
export type Line = {
  id: string;
  /** The service this belongs to (a key of BASE), so lines can be grouped. */
  group: string;
  kind: "need" | "extra" | "rush";
  /** Set for lines that come from a form field, so they can be put back. */
  field?: string;
  choice?: string;
  label: string;
  low: number;
  high: number;
  /** The visitor's answers with this line taken out. */
  without: Values;
};

export type Estimate = {
  low: number;
  high: number;
  /** Set when the visitor asked us to keep looking after it. */
  monthly?: { plan: Plan; price: number; without: Values };
  /** Everything that adds up to low and high, in the order it was asked. */
  lines: Line[];
  /** True when something was picked that cannot be priced from a form. */
  open: boolean;
  /** A website cut down to a single page. */
  onePage: boolean;
};

const list = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];

/** Labels looked up from the form's own options; without an option, the field's label. */
type Labeller = (fieldId: string, optionId?: string) => string | undefined;

/** What a line's field is called when it is an extra of the same kind: "Extra taal: Engels". */
export type PerItemNames = Record<string, string>;

const serviceOf = (fieldId: string) => fieldId.split(".")[0];

/** The answers for one service, so taking the service out takes its details with it. */
function withoutNeed(values: Values, need: string): Values {
  const next: Values = {};
  Object.entries(values).forEach(([key, value]) => {
    if (key === "needs.needs") next[key] = list(value).filter((item) => item !== need);
    else if (!key.startsWith(`${need}.`)) next[key] = value;
  });
  return next;
}

/** A choice taken out: dropped from a list, or set back to the choice that costs nothing. */
function withoutChoice(values: Values, fieldId: string, choice: string): Values {
  const current = values[fieldId];
  const next = { ...values };
  if (Array.isArray(current)) {
    next[fieldId] = current.filter((item) => item !== choice);
    return next;
  }
  const table = EXTRA[fieldId] ?? {};
  const free = Object.keys(table).find((key) => table[key][0] === 0 && table[key][1] === 0);
  if (free) next[fieldId] = free;
  else delete next[fieldId];
  return next;
}

export function estimate(
  values: Values,
  label: Labeller,
  perItem: PerItemNames = {},
  rushLabel = "",
): Estimate | null {
  const needs = list(values["needs.needs"]);
  if (needs.length === 0) return null;

  const lines: Line[] = [];
  let open = false;
  const onePage = needs.includes("website") && values["website.pages"] === "1";

  needs.forEach((need) => {
    const base = BASE[need];
    if (!base) return;
    if (need === "other") {
      open = true;
      return;
    }
    const cut = need === "website" && onePage ? EXTRA["website.pages"]["1"] : ([0, 0] as Band);
    const band = add(base, cut);
    lines.push({
      id: `need:${need}`,
      group: need,
      kind: "need",
      label: label("needs.needs", need) ?? need,
      low: band[0],
      high: band[1],
      without: withoutNeed(values, need),
    });
  });

  Object.entries(EXTRA).forEach(([fieldId, table]) => {
    const group = serviceOf(fieldId);
    if (!needs.includes(group)) return;
    list(values[fieldId]).forEach((choice) => {
      const amount = table[choice];
      // Free choices add nothing, and the one-page cut is already in the base.
      if (!amount || amount[0] <= 0 || amount[1] <= 0) return;
      lines.push({
        id: `${fieldId}:${choice}`,
        group,
        kind: "extra",
        field: fieldId,
        choice,
        label: label(fieldId, choice) ?? choice,
        low: amount[0],
        high: amount[1],
        without: withoutChoice(values, fieldId, choice),
      });
    });
  });

  Object.entries(PER_ITEM).forEach(([fieldId, rule]) => {
    const group = serviceOf(fieldId);
    if (!needs.includes(group)) return;
    list(values[fieldId])
      .slice(rule.free)
      .forEach((choice) => {
        const name = label(fieldId, choice) ?? choice;
        lines.push({
          id: `${fieldId}:${choice}`,
          group,
          kind: "extra",
          field: fieldId,
          choice,
          label: perItem[fieldId] ? `${perItem[fieldId]}: ${name}` : name,
          low: rule.each[0],
          high: rule.each[1],
          without: withoutChoice(values, fieldId, choice),
        });
      });
  });

  if (lines.length === 0) return null;

  let low = lines.reduce((sum, line) => sum + line.low, 0);
  let high = lines.reduce((sum, line) => sum + line.high, 0);

  if (values["plan.timeline"] === "asap") {
    const extraLow = low * (RUSH - 1);
    const extraHigh = high * (RUSH - 1);
    lines.push({
      id: "rush",
      group: "all",
      kind: "rush",
      field: "plan.timeline",
      choice: "asap",
      label: rushLabel,
      low: extraLow,
      high: extraHigh,
      without: { ...values, "plan.timeline": "quarter" },
    });
    low += extraLow;
    high += extraHigh;
  }

  // To the nearest fifty, so it reads as an indication and not as a quote.
  const round = (n: number) => Math.round(n / 50) * 50;
  const rounded = lines.map((line) => ({ ...line, low: round(line.low), high: round(line.high) }));

  const wantsCare = values["plan.maintenance"] === "studio" || values["website.editing"] === "talk";
  const plan = planFor(needs, values);
  const withoutCare: Values = { ...values, "plan.maintenance": "self" };
  if (values["website.editing"] === "talk") withoutCare["website.editing"] = "self";

  return {
    low: round(low),
    high: round(high),
    monthly: wantsCare ? { plan, price: PLAN_PRICE[plan], without: withoutCare } : undefined,
    lines: rounded,
    open,
    onePage,
  };
}

/**
 * The upper end of each budget the form offers. A visitor's budget is a band,
 * and the package fits when even its high estimate is inside the top of it.
 */
export const BUDGET_MAX: Record<string, number> = {
  "lt-2500": 2500,
  "2500-5k": 5000,
  "5-10k": 10000,
  "10-25k": 25000,
  "gt-25k": Number.POSITIVE_INFINITY,
};

/**
 * Takes things out, biggest first, until the package fits the budget: the
 * extras, then the website down to a single page, then whole services, always
 * leaving one. It never touches what the visitor chose to keep by hand: the
 * caller shows the result and lets them put anything back.
 */
export function fitToBudget(
  values: Values,
  label: Labeller,
  max: number,
  perItem: PerItemNames = {},
  rushLabel = "",
): Values {
  let current = values;
  for (let step = 0; step < 40; step += 1) {
    const result = estimate(current, label, perItem, rushLabel);
    if (!result || result.high <= max) break;

    /**
     * Within a tier, the smallest thing that is enough on its own, so a
     * package that is a little over loses a little. If nothing is enough on
     * its own, the biggest, and the next round carries on.
     */
    const choose = (options: { value: Values; saves: number }[]) => {
      const enough = options.filter((option) => result.high - option.saves <= max);
      const pool = enough.length > 0 ? enough : options;
      return pool.sort((a, b) => (enough.length > 0 ? a.saves - b.saves : b.saves - a.saves))[0];
    };

    const extras = result.lines
      .filter((line) => line.kind !== "need")
      .map((line) => ({ value: line.without, saves: line.high }));
    if (extras.length > 0) {
      current = choose(extras).value;
      continue;
    }

    if (list(current["needs.needs"]).includes("website") && current["website.pages"] !== "1") {
      current = { ...current, "website.pages": "1" };
      continue;
    }

    const services = result.lines.filter((line) => line.kind === "need");
    if (services.length > 1) {
      current = choose(services.map((line) => ({ value: line.without, saves: line.high }))).value;
      continue;
    }
    break;
  }
  return current;
}

/** Puts a line back, using the answers the visitor started the review with. */
export function restoreLine(baseline: Values, current: Values, line: Line): Values {
  if (line.kind === "need") {
    const need = line.id.replace("need:", "");
    const next: Values = { ...current };
    Object.entries(baseline).forEach(([key, value]) => {
      if (key.startsWith(`${need}.`)) next[key] = value;
    });
    next["needs.needs"] = list(baseline["needs.needs"]).filter(
      (item) => item === need || list(current["needs.needs"]).includes(item),
    );
    return next;
  }
  if (!line.field) return current;
  const was = baseline[line.field];
  const next: Values = { ...current };
  if (Array.isArray(was)) {
    const now = list(current[line.field]);
    next[line.field] = was.filter((item) => item === line.choice || now.includes(item));
  } else if (was !== undefined) {
    next[line.field] = was;
  }
  return next;
}

export function formatEuro(amount: number, lang: string): string {
  // Dutch puts a non-breaking space after the euro sign (" 3.500"); the rest
  // of the site writes it tight, so this does too.
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : "nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\u00a0/g, "");
}
