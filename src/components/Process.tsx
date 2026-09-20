import { Reveal } from "./Reveal";
import type { Content } from "@/content";

export function Process({ content }: { content: Content }) {
  return (
    <section
      id="werkwijze"
      className="relative scroll-mt-24 border-t border-hairline py-28 md:py-40"
    >
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Reveal>
                <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
                  {content.process.title}
                </h2>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="mt-5 max-w-[38ch] text-[17px] leading-[1.6] text-text-muted">
                  {content.process.lead}
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="md:col-span-8 md:pl-6">
            {content.process.steps.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 0.05}>
                <div
                  className={`border-b border-hairline pb-8 ${
                    index === 0 ? "pt-0" : "pt-8"
                  }`}
                >
                  <h3 className="font-display text-[24px] font-medium text-text md:text-[30px]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-[16px] leading-[1.6] text-text-muted">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
