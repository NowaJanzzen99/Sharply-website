import { notFound } from "next/navigation";
import { Intro } from "@/components/Intro";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Services } from "@/components/Services";
import { TalkDemo } from "@/components/TalkDemo";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { ContactForm } from "@/components/ContactForm";
import { getContent, isLang } from "@/content";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const content = getContent(lang);

  return (
    <>
      <Intro />
      <main id="main">
        <Hero content={content} />
        <Manifesto content={content} />
        <Services content={content} lang={lang} />
        <TalkDemo content={content} />
        <Work content={content} lang={lang} />
        <Process content={content} />
        <Pricing content={content} lang={lang} />
        <ContactForm content={content} lang={lang} />
      </main>
    </>
  );
}
