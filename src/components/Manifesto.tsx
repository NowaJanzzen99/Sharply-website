import { Reveal, RevealLines } from "./Reveal";
import { StudioStage } from "./StudioStage";
import type { Content } from "@/content";

/*
  The section that says who is behind the work. A face is the first thing a
  small business looks for before it hands over money, so it comes straight
  after the hero, and it is staged rather than dropped in: the portrait holds
  the screen while the things Noah builds fly in around him (StudioStage).

  Heading first, so the scene has a caption before it starts; the longer text
  after, once the cards have landed.
*/

export function Manifesto({ content }: { content: Content }) {
  return (
    <section id="studio" className="relative scroll-mt-24 pt-28 md:pt-40">
      <div className="container-page">
        <h2 className="max-w-[18ch] font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
          <RevealLines lines={[content.manifesto.title]} onView />
        </h2>
        <p className="mt-6 max-w-[34ch] font-display text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em] text-text-muted">
          <RevealLines lines={content.manifesto.lead.split(/(?<=\.)\s+/)} onView />
        </p>
      </div>

      <StudioStage content={content} />

      <div className="container-page pb-28 md:pb-40">
        <div className="grid gap-6 md:grid-cols-3 md:gap-10">
          {content.manifesto.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.06}>
              <p className="text-[17px] leading-[1.6] text-text-muted">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
