import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { RevealLines } from "../Reveal";

/*
  Where to go next.

  These carried only text at first, which made the bottom of every page a set
  of grey boxes after a page full of glass. They carry their picture now, each
  one entering from its own direction, and the picture drifts in its frame on
  hover. A page that ends well is a page someone stays on.
*/

export type RelatedItem = {
  href: string;
  /** Content key. Deliberately not used as a transition name here: these
      cards sit below the fold of the page they lead from, and a named element
      the eye cannot see would only leave a ghost behind during the morph. */
  key: string;
  title: string;
  note: string;
  image: string;
  alt: string;
};

const VARIANTS = ["left", "up", "right"];

export function DetailRelated({
  title,
  readMore,
  items,
}: {
  title: string;
  readMore: string;
  items: RelatedItem[];
}) {
  return (
    <section className="border-t border-hairline py-20 md:py-28">
      <div className="container-page">
        <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium text-text">
          <RevealLines lines={[title]} onView />
        </h2>

        <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item.href}
              data-scene="photo"
              data-scene-variant={VARIANTS[index % VARIANTS.length]}
              data-scene-lag={index * 0.06}
              className="group relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-hairline">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  data-scene-img
                  className="object-cover"
                />
              </div>

              <h3 className="mt-5 font-display text-[20px] font-medium text-text">
                <Link
                  href={item.href}
                  className="inline-flex items-start gap-2 after:absolute after:inset-0 after:content-['']"
                >
                  {item.title}
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    className="mt-[0.35em] shrink-0 text-text-faint transition-[transform,color] duration-200 ease-[var(--ease-out)] group-hover:text-accent-bright hover-fine:group-hover:translate-x-0.5 hover-fine:group-hover:-translate-y-0.5"
                  />
                </Link>
              </h3>
              <p className="mt-2 max-w-[38ch] text-[15px] leading-[1.55] text-text-muted">
                {item.note}
              </p>
              <span className="sr-only">{readMore}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
