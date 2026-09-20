import type { Content, Lang } from "./types";
import { nl } from "./nl";
import { en } from "./en";

const dictionaries: Record<Lang, Content> = { nl, en };

export function getContent(lang: Lang): Content {
  return dictionaries[lang];
}

export * from "./types";
