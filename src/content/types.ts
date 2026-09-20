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
    items: {
      key: string;
      title: string;
      discipline: string;
      blurb: string;
      image: string;
      alt: string;
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
