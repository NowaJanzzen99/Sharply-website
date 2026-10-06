/*
  The one place the site's own address is decided. The production domain is the
  default, so a missing environment variable can never put the vercel.app
  address in a canonical link, a sitemap or structured data: search engines
  would index the wrong host and split the page's standing between two.
*/
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sharply.nl").replace(/\/$/, "");

export const SITE_NAME = "Sharply";
export const OWNER = "Noah Janssen";

export const absolute = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** A search-result description: whole words, never more than 155 characters. */
export function clip(text: string, max = 155): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
