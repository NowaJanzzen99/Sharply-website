import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "@phosphor-icons/react/dist/ssr";
import { RevealLines } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { FloatingOrb } from "./hero/FloatingOrb";
import { workHref, type Content, type Lang } from "@/content";

/*
  One bubble, one image, from the first paint onwards. An earlier version faded
  a WebGL orb in over the still once the canvas was ready, and the hero visibly
  flattened at the swap. The still is the better render, so it stays and the
  motion is built around it instead.
*/

export function Hero({ content, lang }: { content: Content; lang: Lang }) {
  return (
    <section className="relative isolate grain flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-canvas-deep pb-16 pt-32 md:justify-center md:pb-24">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <FloatingOrb />
      </div>

      {/* Planet rim along the bottom edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] opacity-90 [mask-image:linear-gradient(to_top,black_45%,transparent)]"
      >
        <Image
          src="/images/bg-horizon.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-top"
        />
      </div>

      {/* Scrim, so the headline always wins over whatever is behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,oklch(0.09_0.022_264)_22%,oklch(0.09_0.022_264/0.84)_48%,oklch(0.09_0.022_264/0.28)_70%,transparent_92%)] md:bg-[linear-gradient(to_right,oklch(0.09_0.022_264)_12%,oklch(0.09_0.022_264/0.78)_40%,oklch(0.09_0.022_264/0.2)_62%,transparent_84%)]"
      />

      {/* Above the grain, which would otherwise dull the headline. */}
      <div className="container-page relative z-[1]">
        <h1 className="font-display text-[clamp(2.1rem,6.6vw,4.6rem)] font-semibold text-text">
          <RevealLines
            lines={[content.hero.lineOne, content.hero.lineTwo]}
            lineClassName="whitespace-nowrap"
          />
        </h1>

        <p
          data-reveal-hero
          style={{ animationDelay: "0.34s" }}
          className="mt-7 max-w-[46ch] text-[17px] leading-[1.55] text-text-muted md:text-[19px]"
        >
          {content.hero.body}
        </p>

        <div
          data-reveal-hero
          style={{ animationDelay: "0.44s" }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <MagneticButton
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-[16px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-accent-bright active:scale-[0.97]"
          >
            {content.hero.primary}
            <ArrowDownRight
              size={18}
              weight="bold"
              className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
          </MagneticButton>
          <MagneticButton
            href="#prijzen"
            className="inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-hairline-strong px-6 py-3.5 text-[16px] text-text transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-canvas-raised active:scale-[0.97]"
          >
            {content.hero.secondary}
          </MagneticButton>
          <p className="text-[14px] text-text-muted sm:ml-3">{content.hero.price}</p>
        </div>

        {/* Proof in the first screen: the work that is online, one tap away. */}
        <div
          data-reveal-hero
          style={{ animationDelay: "0.56s" }}
          className="mt-12 flex flex-wrap items-center gap-x-2 gap-y-3"
        >
          <span className="mr-2 flex items-center gap-2 text-[13px] text-text-faint">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.17_150)] shadow-[0_0_8px_oklch(0.78_0.17_150)]"
            />
            {content.hero.proof}
          </span>
          {content.work.items.map((item) => (
            <Link
              key={item.key}
              href={workHref(lang, item.key)}
              className="group/proof flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-hairline bg-canvas-deep/60 py-1 pl-1 pr-3.5 text-[13px] text-text-muted transition-[border-color,color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:border-hairline-strong hover-fine:hover:text-text"
            >
              <span className="relative h-6 w-9 overflow-hidden rounded-full">
                <Image src={item.thumb ?? item.image} alt="" fill sizes="36px" className="object-cover object-left-top" />
              </span>
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
