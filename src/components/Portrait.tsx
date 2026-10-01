import Image from "next/image";
import { RevealImage } from "./Reveal";

/*
  The portrait, set into the page rather than dropped onto it.

  The photo was shot on black, so instead of a flat rectangle with a border it
  is laid over a cobalt-lit panel with a lighten blend: the black falls away
  and the glow shows through, while the face, being brighter than the glow,
  stays exactly as it was shot. The bottom dissolves into the panel so the
  shoulders do not end in a hard crop.

  Two of the hero's own bubbles float in front of it, which ties the face to
  the one image the site is known for. They drift on transform only, and sit
  still for people who ask for reduced motion.

  The motion around it is the same as every other picture on the page: the
  card slides in on its axis (data-scene), the curtain opens as a circle
  (RevealImage), and the photo itself settles out of a zoom (data-scene-img).
*/

export function Portrait({ alt, name, line }: { alt: string; name: string; line: string }) {
  return (
    <div data-scene="photo" data-scene-variant="right" className="md:col-span-5 md:pt-4">
      <RevealImage variant="circle" className="relative">
        <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-[radial-gradient(90%_70%_at_82%_8%,oklch(0.5_0.17_259/0.9)_0%,oklch(0.26_0.09_262/0.7)_38%,oklch(0.14_0.03_264)_75%)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(60%_50%_at_8%_96%,oklch(0.42_0.15_300/0.5)_0%,transparent_70%)]"
          />

          <Image
            src="/images/noah.webp"
            alt={alt}
            fill
            sizes="(min-width: 768px) 38vw, 100vw"
            data-scene-img
            className="object-cover object-top mix-blend-lighten [mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)]"
          />

          <Image
            src="/images/orb.webp"
            alt=""
            aria-hidden="true"
            width={700}
            height={696}
            sizes="(min-width: 768px) 22vw, 50vw"
            className="portrait-bubble pointer-events-none absolute -right-[9%] bottom-[21%] w-[31%]"
          />
          <Image
            src="/images/orb-small.webp"
            alt=""
            aria-hidden="true"
            width={210}
            height={208}
            sizes="12vw"
            className="portrait-bubble pointer-events-none absolute left-[7%] top-[11%] w-[13%] [animation-delay:-3s]"
          />

          <div className="glass absolute inset-x-4 bottom-4 flex items-baseline justify-between gap-4 rounded-[var(--radius-md)] px-5 py-4 md:inset-x-5 md:bottom-5">
            <p className="font-display text-[17px] font-medium text-text">{name}</p>
            <p className="text-[14px] text-text-muted">{line}</p>
          </div>
        </div>
      </RevealImage>
    </div>
  );
}
