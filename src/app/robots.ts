import type { MetadataRoute } from "next";
import { SITE_URL as base } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing to crawl here: it only answers POST, and only from the form.
      disallow: "/api/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
