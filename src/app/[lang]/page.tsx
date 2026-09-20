import { notFound } from "next/navigation";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Services } from "@/components/Services";
import { TalkDemo } from "@/components/TalkDemo";
import { Work } from "@/components/Work";
import { Process } from "@/components/Process";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
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
      <Nav content={content} lang={lang} />
      <main>
        <Hero content={content} />
        <Manifesto content={content} />
        <Services content={content} />
        <TalkDemo content={content} />
        <Work content={content} />
        <Process content={content} />
        <ContactForm content={content} lang={lang} />
      </main>
      <Footer content={content} lang={lang} />
    </>
  );
}
