import { notFound } from "next/navigation";
import { Intro } from "@/components/Intro";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Services } from "@/components/Services";
import { TalkDemo } from "@/components/TalkDemo";
import { Work } from "@/components/Work";
import { Testimonial } from "@/components/Testimonial";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { DetailQuestions } from "@/components/detail/DetailQuestions";
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
      {/* The same questions as data, so a search engine can show them. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faq.items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />
      <Intro />
      <main id="main">
        <Hero content={content} lang={lang} />
        {/* The portrait scene first, then the work: the face, then the proof. */}
        <Manifesto content={content} />
        <Work content={content} lang={lang} />
        {content.testimonial ? <Testimonial testimonial={content.testimonial} /> : null}
        <Services content={content} lang={lang} />
        <TalkDemo content={content} />
        <Process content={content} />
        <Pricing content={content} lang={lang} />
        <DetailQuestions id="vragen" title={content.faq.title} items={content.faq.items} />
        <ContactForm content={content} lang={lang} />
      </main>
    </>
  );
}
