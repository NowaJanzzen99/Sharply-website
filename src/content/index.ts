import { LANGS, SECTION_PATHS } from "./types";
import type { Content, Details, Lang, ServiceKey } from "./types";
import { nl } from "./nl";
import { en } from "./en";
import { detailsNl } from "./details-nl";
import { detailsEn } from "./details-en";

const dictionaries: Record<Lang, Content> = { nl, en };
const detailDictionaries: Record<Lang, Details> = { nl: detailsNl, en: detailsEn };

export function getContent(lang: Lang): Content {
  return dictionaries[lang];
}

export function getDetails(lang: Lang): Details {
  return detailDictionaries[lang];
}

/**
 * The link to a service or project page, in the right language.
 *
 * Slugs are translated, so the same service has a different address in each
 * language. Everything that links to a detail page goes through here, which is
 * what keeps the language switcher on those pages able to find its counterpart.
 */
export function serviceHref(lang: Lang, key: ServiceKey): string {
  const { services } = detailDictionaries[lang];
  return `/${lang}/${SECTION_PATHS[lang].services}/${services[key].slug}`;
}

export function workHref(lang: Lang, key: string): string {
  const { work } = detailDictionaries[lang];
  const item = work[key];
  return item ? `/${lang}/${SECTION_PATHS[lang].work}/${item.slug}` : `/${lang}`;
}

/** Turns a slug back into the key it belongs to, for routing. */
export function serviceKeyFromSlug(lang: Lang, slug: string): ServiceKey | null {
  const { services } = detailDictionaries[lang];
  const found = Object.entries(services).find(([, detail]) => detail.slug === slug);
  return found ? (found[0] as ServiceKey) : null;
}

export function workKeyFromSlug(lang: Lang, slug: string): string | null {
  const { work } = detailDictionaries[lang];
  const found = Object.entries(work).find(([, detail]) => detail.slug === slug);
  return found ? found[0] : null;
}

export * from "./types";

/**
 * Every detail page mapped to the same page in the other language.
 *
 * Both the path segment and the slug are translated, so swapping "/nl" for
 * "/en" in an address lands on nothing. The layout builds this map on the
 * server and hands it to the language switcher, which keeps the prose files
 * out of the browser bundle: the map itself is a few hundred bytes.
 */
export function getAlternates(): Record<string, string> {
  const map: Record<string, string> = { "/nl": "/en", "/en": "/nl" };

  for (const lang of LANGS) {
    const other: Lang = lang === "nl" ? "en" : "nl";
    const details = detailDictionaries[lang];

    for (const key of Object.keys(details.services) as ServiceKey[]) {
      map[serviceHref(lang, key)] = serviceHref(other, key);
    }
    for (const key of Object.keys(details.work)) {
      map[workHref(lang, key)] = workHref(other, key);
    }
  }

  return map;
}
