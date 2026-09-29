import type { MetadataRoute } from "next";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sharply-website.vercel.app").replace(
  /\/$/,
  "",
);

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
