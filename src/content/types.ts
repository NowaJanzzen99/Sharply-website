export const LANGS = ["nl", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "nl";

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export type ServiceKey =
  | "websites"
  | "aiChat"
  | "webshop"
  | "integrations"
  | "branding"
  | "aiContent";

export type Service = {
  key: ServiceKey;
  title: string;
  body: string;
  points: string[];
  image: string;
  alt: string;
  /** Placeholder copy: Noah replaces this once the offer is final. */
  placeholder: true;
};

/*
  Detail pages.

  The overview copy and the detail copy live apart on purpose: the overview is
  one tight line per service, written to be scanned in a reel, and the detail is
  the page someone lands on when that line worked. Keeping them in one object
  would push nl.ts past the point where either can be edited without scrolling.
  They are joined by the same key, in src/content/details-nl.ts and -en.ts.

  Every path segment is translated, so a Dutch visitor never sees an English URL.
  One route handles both: src/app/[lang]/[section]/[slug].
*/
export const SECTION_PATHS = {
  nl: { services: "diensten", work: "werk" },
  en: { services: "services", work: "work" },
} as const;

export type SectionKind = keyof (typeof SECTION_PATHS)["nl"];

export function sectionPath(lang: Lang, kind: SectionKind): string {
  return SECTION_PATHS[lang][kind];
}

/** Which kind of page a path segment belongs to, or null if it is not one of ours. */
export function sectionKind(lang: Lang, segment: string): SectionKind | null {
  const paths = SECTION_PATHS[lang];
  if (segment === paths.services) return "services";
  if (segment === paths.work) return "work";
  return null;
}

export type DetailSection = {
  title: string;
  body: string;
};

export type ServiceDetail = {
  /** Translated, so /nl/diensten/ai-chat and /en/services/ai-chat can differ. */
  slug: string;
  /** One line under the title. Not a repeat of the overview line. */
  tagline: string;
  intro: string;
  sections: DetailSection[];
  /** What is actually handed over at the end. */
  deliverables: string[];
  /** Straight answers to the questions people ask before they get in touch. */
  questions: { question: string; answer: string }[];
};

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type WorkDetail = {
  slug: string;
  tagline: string;
  intro: string;
  sections: DetailSection[];
  /** What was made. For a concept, what it covers: never a result. */
  scope: string[];
  /** Concepts only: says plainly that this is our own design, not client work. */
  note?: string;
  /** Real work only: the live address. */
  url?: string;
  /** Real work only: a screenshot of the whole page, scrolled inside a device. */
  page?: GalleryImage;
  /** Real work only: more pictures, shown in a gallery that moves with scroll. */
  gallery?: GalleryImage[];
  /** Facts shown under the title: who, what, where. Never numbers we cannot back. */
  facts?: { label: string; value: string }[];
};

/** The shared furniture of a detail page: labels, links, the closing call. */
export type DetailCopy = {
  /** Link to a live client site. */
  visit: string;
  /** Heading over the gallery on a real case. */
  gallery: string;
  /** Heading over the scope list on a real case, where "concept" would be untrue. */
  made: string;
  backToServices: string;
  backToWork: string;
  deliverables: string;
  questions: string;
  scope: string;
  otherServices: string;
  otherWork: string;
  readMore: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  notFound: {
    title: string;
    body: string;
    home: string;
  };
};

export type Details = {
  copy: DetailCopy;
  services: Record<ServiceKey, ServiceDetail>;
  work: Record<string, WorkDetail>;
};

export type DemoCommand = {
  id: "headline" | "light" | "shop" | "publish";
  label: string;
  reply: string;
};

export type Option = { id: string; label: string };

type FieldBase = {
  /** Unique across the whole form, prefixed by the step or need it belongs to. */
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  /** Sit two short fields side by side on wider screens. */
  half?: boolean;
};

export type Field =
  | (FieldBase & { kind: "chips"; multi?: boolean; options: Option[] })
  | (FieldBase & { kind: "select"; options: Option[]; placeholder?: string })
  | (FieldBase & {
      kind: "text" | "email" | "tel" | "url" | "date";
      placeholder?: string;
      autoComplete?: string;
    })
  | (FieldBase & {
      kind: "area";
      placeholder?: string;
      rows?: number;
      min?: number;
    })
  | (FieldBase & { kind: "files" })
  | (FieldBase & { kind: "consent" });

export type FormStep = {
  id: string;
  title: string;
  hint: string;
  fields: Field[];
};

/** Follow-up questions that only appear for the services the visitor picked. */
export type DetailGroup = {
  need: string;
  title: string;
  fields: Field[];
};

export type Content = {
  meta: {
    title: string;
    description: string;
    localeTag: string;
  };
  nav: {
    links: { href: string; label: string }[];
    cta: string;
    menuOpen: string;
    menuClose: string;
    langLabel: string;
  };
  hero: {
    lineOne: string;
    lineTwo: string;
    body: string;
    primary: string;
    secondary: string;
    imageAlt: string;
  };
  manifesto: {
    title: string;
    lead: string;
    body: string[];
    imageAlt: string;
  };
  services: {
    title: string;
    lead: string;
    items: Service[];
  };
  demo: {
    title: string;
    lead: string;
    note: string;
    tryTitle: string;
    tryHint: string;
    inputLabel: string;
    inputPlaceholder: string;
    send: string;
    reset: string;
    unknownReply: string;
    unpublishedNote: string;
    commands: DemoCommand[];
    preview: {
      brand: string;
      headline: string;
      headlineBig: string;
      body: string;
      cta: string;
      shopTitle: string;
      shopItems: { name: string; price: string }[];
    };
    deploy: {
      building: string;
      live: string;
      url: string;
    };
    transcriptLabel: string;
  };
  work: {
    title: string;
    lead: string;
    body: string;
    conceptLabel: string;
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
    /** Shown on real client work instead of conceptLabel. */
    clientLabel: string;
    items: {
      key: string;
      title: string;
      discipline: string;
      blurb: string;
      image: string;
      alt: string;
      /** True for real client work. Everything else is labelled as a concept. */
      real?: boolean;
    }[];
  };
  process: {
    title: string;
    lead: string;
    steps: { title: string; body: string }[];
  };
  contact: {
    title: string;
    lead: string;
    progress: string;
    optional: string;
    required: string;
    invalidEmail: string;
    invalidUrl: string;
    pickOne: string;
    tooShort: string;
    consentRequired: string;
    next: string;
    back: string;
    submit: string;
    sending: string;
    edit: string;
    reviewTitle: string;
    reviewIntro: string;
    empty: string;
    noDetails: string;
    selectPlaceholder: string;
    filesHint: string;
    filesAdd: string;
    filesRemove: string;
    filesTooBig: string;
    filesTooMany: string;
    filesType: string;
    successTitle: string;
    successBody: string;
    againLabel: string;
    errorTitle: string;
    errorBody: string;
    steps: FormStep[];
    detailGroups: DetailGroup[];
    /** The indication shown on the last step, worked out from the answers. */
    price: {
      title: string;
      to: string;
      /** Said right under the amount: businesses read a price as excluding VAT unless told. */
      vat: string;
      driversTitle: string;
      care: string;
      open: string;
      note: string;
    };
  };
  footer: {
    contactTitle: string;
    email: string;
    legalNote: string;
    placeholders: string[];
    socialTitle: string;
    socialNote: string;
    rights: string;
  };
};
