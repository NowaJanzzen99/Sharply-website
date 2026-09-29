import { Check } from "@phosphor-icons/react/dist/ssr";
import { RevealLines } from "../Reveal";

/*
  What you get, or what a concept covers.

  A bulleted list in a box is the lazy answer, and it reads as filler. This is
  a full width band of hairline rows instead, each one arriving from the side a
  beat after the one above it. The rows are wide and quiet, which is what makes
  a list of six promises feel like a specification rather than a sales bullet.
*/
export function DetailList({
  title,
  items,
  note,
}: {
  title: string;
  items: string[];
  note?: string;
}) {
  return (
    <section className="border-t border-hairline py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium text-text">
              <RevealLines lines={[title]} onView />
            </h2>
            {note ? (
              <p className="mt-5 max-w-[38ch] text-[14px] leading-[1.6] text-text-faint">
                {note}
              </p>
            ) : null}
          </div>

          <ol className="md:col-span-7 md:col-start-6">
            {items.map((item, index) => (
              <li
                key={item}
                data-scene="row"
                data-scene-lag={index * 0.05}
                className="flex items-start gap-5 border-b border-hairline py-5 first:border-t"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-hairline-strong text-accent-bright"
                >
                  <Check size={12} weight="bold" />
                </span>
                <span className="text-[16px] leading-[1.55] text-text md:text-[17px]">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
