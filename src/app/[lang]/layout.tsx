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
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://sharply-website.vercel.app",
    ),
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { nl: "/nl", en: "/en" },
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      locale: content.meta.localeTag,
      type: "website",
    },
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
        {/* Who we are, for search engines: the same facts as the footer. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Sharply",
              url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sharply-website.vercel.app",
              email: content.footer.email,
              identifier: { "@type": "PropertyValue", propertyID: "KvK", value: "76336840" },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Scheidingsweg 2",
                postalCode: "6045 CR",
                addressLocality: "Roermond",
                addressCountry: "NL",
              },
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
