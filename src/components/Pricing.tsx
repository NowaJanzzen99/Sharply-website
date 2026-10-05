import { ArrowDownRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealLines } from "./Reveal";
import { formatEuro } from "@/lib/estimate";
import type { Content, Lang } from "@/content";

/*
  The public price list.

  Three things it does on purpose, and why:

  It is a ladder, not a row of three cards. Three identical boxes read as a
  template and invite comparing them like items in a shop, which is the wrong
  conversation for custom work. Rows read as a specification: a name, a figure,
  what is in it.

  The middle rung is lifted and lit. Given three options most people take the
  middle one, so it is the one the page makes easy to take. The top rung sits
  underneath it as an anchor, so the middle one looks reasonable next to it.

  The figures are round. Prices ending in 99 read as a discount; on custom work
  a round figure reads as confidence.

  Three tiers, not four: anything bigger than Studio is one line underneath,
  and the monthly care is one price with the bigger plans as a sentence. Every
  extra option on a price list is another reason to put off the decision.
*/
export function Pricing({ content, lang }: { content: Content; lang: Lang }) {
  const copy = content.pricing;

  return (
    <section
      id="prijzen"
      className="relative scroll-mt-24 border-t border-hairline py-28 md:py-40"
    >
      <div className="container-page">
        <div className="max-w-[54ch]">
          <h2 className="font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold text-text">
            <RevealLines lines={[copy.title]} onView />
          </h2>
          <Reveal delay={0.06}>
            <p className="mt-5 text-[17px] leading-[1.6] text-text-muted md:text-[19px]">
              {copy.lead}
            </p>
          </Reveal>
        </div>

        {/* Websites */}
        <div className="mt-16 md:mt-20">
          <h3 className="text-[14px] font-medium text-text-faint">{copy.websitesTitle}</h3>

          <ol className="mt-5 flex flex-col">
            {copy.tiers.map((tier, index) => (
              <li
                key={tier.name}
                data-scene="panel"
                data-scene-variant="up"
                data-scene-lag={index * 0.05}
                className={
                  tier.recommended
                    ? "glass my-2 rounded-[var(--radius-lg)] px-6 py-8 md:px-8 md:py-10"
                    : "border-b border-hairline px-6 py-8 first:border-t md:px-8"
                }
              >
                <div className="grid gap-x-10 gap-y-5 md:grid-cols-12 md:items-start">
                  <div className="md:col-span-3">
                    <p className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.03em] text-text">
                      {tier.name}
                    </p>
                    {tier.recommended ? (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-accent/60 px-3 py-1 text-[12px] text-accent-bright">
                        {copy.recommended}
                      </p>
                    ) : null}
                  </div>

                  <div className="md:col-span-3">
                    <p className="font-display text-[clamp(1.75rem,3.4vw,2.6rem)] font-semibold leading-none tracking-[-0.035em] text-text">
                      {tier.from ? (
                        <span className="mr-2 text-[max(13px,0.42em)] font-medium tracking-normal text-text-faint">
                          {copy.from}
                        </span>
                      ) : null}
                      {formatEuro(tier.price, lang)}
                    </p>
                  </div>

                  <div className="md:col-span-6">
                    <p className="max-w-[46ch] text-[16px] leading-[1.55] text-text-muted">
                      {tier.body}
                    </p>
                    <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                      {tier.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-[15px] leading-[1.45] text-text"
                        >
                          <Check
                            size={14}
                            weight="bold"
                            aria-hidden="true"
                            className="mt-[0.3em] shrink-0 text-accent-bright"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Bigger than the top tier: one line, not a fourth package. */}
        <div className="mt-6 flex flex-col gap-1 border-b border-hairline px-6 pb-8 md:flex-row md:items-baseline md:gap-6 md:px-8">
          <p className="shrink-0 font-display text-[18px] font-medium text-text">{copy.beyondTitle}</p>
          <p className="text-[16px] leading-[1.55] text-text-muted">{copy.beyondText}</p>
        </div>

        {/* After launch: one price, the bigger plans as a line under it. */}
        <div className="mt-20 grid gap-8 md:mt-28 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <h3 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-medium text-text">
              <RevealLines lines={[copy.careTitle]} onView />
            </h3>
          </div>
          <div className="md:col-span-8">
            <Reveal delay={0.06}>
              <p className="font-display text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold leading-none tracking-[-0.03em] text-text">
                <span className="mr-2 text-[max(13px,0.42em)] font-medium tracking-normal text-text-faint">
                  {copy.from}
                </span>
                {formatEuro(copy.plans[0].price, lang)}
                <span className="ml-2 text-[max(13px,0.4em)] font-medium tracking-normal text-text-faint">
                  {copy.perMonth}
                </span>
              </p>
              <p className="mt-4 max-w-[58ch] text-[16px] leading-[1.6] text-text-muted">{copy.careLead}</p>
              <p className="mt-2 max-w-[58ch] text-[14px] leading-[1.6] text-text-faint">{copy.careMore}</p>
            </Reveal>
          </div>
        </div>

        {/* Everything else */}
        <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <h3 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-medium text-text">
              <RevealLines lines={[copy.otherTitle]} onView />
            </h3>
          </div>

          <dl className="md:col-span-8">
            {copy.other.map((item, index) => (
              <div
                key={item.name}
                data-scene="panel"
                data-scene-variant="up"
                data-scene-lag={index * 0.04}
                className="flex items-baseline justify-between gap-6 border-b border-hairline py-4 first:border-t"
              >
                <dt className="text-[16px] text-text">{item.name}</dt>
                <dd className="shrink-0 text-[16px] text-text-muted">{item.price}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-10 max-w-[64ch] text-[14px] leading-[1.6] text-text-faint">
          {copy.vatNote}
        </p>

        {/* Where it leads */}
        <div className="mt-16 flex flex-col items-start gap-6 rounded-[var(--radius-lg)] border border-hairline p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <div>
            <p className="font-display text-[clamp(1.3rem,2.4vw,1.75rem)] font-medium text-text">
              {copy.ctaTitle}
            </p>
            <p className="mt-2 max-w-[52ch] text-[16px] leading-[1.55] text-text-muted">
              {copy.ctaText}
            </p>
          </div>
          <a
            href="#contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-[16px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:bg-accent-bright"
          >
            {copy.ctaButton}
            <ArrowDownRight
              size={18}
              weight="bold"
              className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </a>
        </div>

        <p className="mt-6 text-[15px] text-text-muted">
          <a
            href={`mailto:${content.footer.email}`}
            className="underline decoration-hairline-strong underline-offset-[6px] transition-colors duration-200 ease-out hover:text-text hover:decoration-accent"
          >
            {copy.ctaMail}
          </a>
        </p>
      </div>
    </section>
  );
}
