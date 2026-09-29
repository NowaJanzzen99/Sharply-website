import type { MetadataRoute } from "next";
import { getDetails, LANGS, sectionPath } from "@/content";

/*
  Every page, in both languages, generated from the same dictionaries the pages
  themselves are built from. Add a service or a project and it appears here
  without anyone remembering to update a list.

  SITE_URL is set in Vercel; the vercel.app address is the fallback so a local
  build and a preview build still produce something valid.
*/
const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sharply-website.vercel.app").replace(
  /\/$/,
  "",
);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return LANGS.flatMap((lang) => {
    const details = getDetails(lang);

    const home = {
      url: `${base}/${lang}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    };

    const services = Object.values(details.services).map((detail) => ({
      url: `${base}/${lang}/${sectionPath(lang, "services")}/${detail.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const work = Object.values(details.work).map((detail) => ({
      url: `${base}/${lang}/${sectionPath(lang, "work")}/${detail.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [home, ...services, ...work];
  });
}
