import { Reveal } from "./Reveal";
import type { Content } from "@/content";

/*
  One sentence from a client, set large. It only renders when the content
  files carry a real one: an invented quote is worse than none.
*/
export function Testimonial({
  testimonial,
}: {
  testimonial: NonNullable<Content["testimonial"]>;
}) {
  return (
    <section className="border-t border-hairline py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <figure className="mx-auto max-w-[46ch] text-center">
            <blockquote className="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium leading-[1.3] tracking-[-0.02em] text-text [text-wrap:balance]">
              <span aria-hidden="true" className="text-accent-bright">“</span>
              {testimonial.quote}
              <span aria-hidden="true" className="text-accent-bright">”</span>
            </blockquote>
            <figcaption className="mt-7 text-[15px] text-text-muted">
              <span className="text-text">{testimonial.name}</span>, {testimonial.role}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
