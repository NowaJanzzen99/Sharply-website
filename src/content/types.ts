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

export type FormStep = {
  title: string;
  hint: string;
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
    badge: string;
    slots: { title: string; discipline: string }[];
  };
  process: {
    title: string;
    lead: string;
    steps: { title: string; body: string }[];
  };
  contact: {
    title: string;
    lead: string;
    steps: FormStep[];
    needsLabel: string;
    needs: { id: string; label: string }[];
    projectLabel: string;
    projectPlaceholder: string;
    referencesLabel: string;
    referencesPlaceholder: string;
    budgetLabel: string;
    budgets: { id: string; label: string }[];
    timelineLabel: string;
    timelines: { id: string; label: string }[];
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    phoneLabel: string;
    optional: string;
    next: string;
    back: string;
    submit: string;
    sending: string;
    progress: string;
    successTitle: string;
    successBody: string;
    againLabel: string;
    errorTitle: string;
    errorBody: string;
    required: string;
    invalidEmail: string;
    pickOne: string;
    tooShort: string;
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
