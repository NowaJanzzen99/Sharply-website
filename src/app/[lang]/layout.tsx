import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "../globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageChrome } from "@/components/PageChrome";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { getAlternates, getContent, isLang, LANGS, type Lang } from "@/content";
import { absolute, OWNER, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const content = getContent(lang);

  return {
    // Without a base, the canonical and hreflang links below stay relative,
    // which search engines ignore: both were flagged invalid by Lighthouse.
    metadataBase: new URL(SITE_URL),
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { nl: "/nl", en: "/en", "x-default": "/nl" },
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      locale: content.meta.localeTag,
      alternateLocale: lang === "nl" ? ["en_GB"] : ["nl_NL"],
      type: "website",
      siteName: SITE_NAME,
      url: `/${lang}`,
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
    },
    authors: [{ name: OWNER, url: SITE_URL }],
    creator: OWNER,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const content = getContent(lang);
  const alternates = getAlternates();

  return (
    <html
      lang={lang as Lang}
      // The intro's inline script marks a returning visitor on <html> before hydration.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
    >
      <body>
        {/* Who we are, for search engines: the same facts as the footer, as one
            connected graph (the business, the person behind it, the website). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "ProfessionalService",
                  "@id": `${SITE_URL}/#business`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  email: content.footer.email,
                  description: content.meta.description,
                  image: absolute(`/${lang}/opengraph-image`),
                  priceRange: "€€",
                  areaServed: [{ "@type": "Country", name: "Nederland" }, { "@type": "Place", name: "Limburg" }],
                  founder: { "@id": `${SITE_URL}/#noah` },
                  identifier: { "@type": "PropertyValue", propertyID: "KvK", value: "76336840" },
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Scheidingsweg 2",
                    postalCode: "6045 CR",
                    addressLocality: "Roermond",
                    addressCountry: "NL",
                  },
                  knowsLanguage: ["nl", "en"],
                },
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#noah`,
                  name: OWNER,
                  jobTitle: lang === "nl" ? "Ontwerper en ontwikkelaar" : "Designer and developer",
                  worksFor: { "@id": `${SITE_URL}/#business` },
                  url: SITE_URL,
                  image: absolute("/images/noah-cut.webp"),
                  address: { "@type": "PostalAddress", addressLocality: "Roermond", addressCountry: "NL" },
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  inLanguage: ["nl", "en"],
                  publisher: { "@id": `${SITE_URL}/#business` },
                },
              ],
            }),
          }}
        />
        <SmoothScroll />
        <PageChrome lang={lang as Lang} />
        <Nav content={content} lang={lang as Lang} alternates={alternates} />
        {children}
        <Footer content={content} lang={lang as Lang} alternates={alternates} />
        <StickyCta lang={lang as Lang} label={content.nav.stickyButton} />
      </body>
    </html>
  );
}
