import type { MetadataRoute } from "next";
import { getDetails, LANGS, sectionPath } from "@/content";
import { SITE_URL } from "@/lib/site";

/*
  Every page, in both languages, generated from the same dictionaries the pages
  themselves are built from. Add a service or a project and it appears here
  without anyone remembering to update a list.

  The date is the day the content last changed, set by hand. Stamping every
  page with the build time tells a crawler that everything changes daily, which
  teaches it to stop trusting the field.
*/
const MODIFIED = new Date("2026-10-06");
const base = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = MODIFIED;

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

    const privacy = {
      url: `${base}/${lang}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    };

    return [home, ...services, ...work, privacy];
  });
}
