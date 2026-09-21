import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "../globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageChrome } from "@/components/PageChrome";
import { getContent, isLang, LANGS, type Lang } from "@/content";

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

  return (
    <html
      lang={lang as Lang}
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
    >
      <body>
        <SmoothScroll />
        <PageChrome lang={lang as Lang} />
        {children}
      </body>
    </html>
  );
}
