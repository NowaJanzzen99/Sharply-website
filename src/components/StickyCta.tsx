"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import type { Lang } from "@/content";

/*
  The glass pill at the foot of the screen: one way into the form, always in
  reach, wherever someone is on the site.

  It steps aside twice, on purpose. Over the first screen of the homepage the
  hero already carries the same button, and two identical calls to action on
  one screen read as pushy, so the pill rises once the hero has been scrolled
  past. And once the form itself is on screen there is nothing left to point
  at, so it sinks away again. Everywhere else it stays.

  It moves on transform and opacity only, and sits above the device's own
  home indicator on phones (env(safe-area-inset-bottom)).
*/
export function StickyCta({
  lang,
  text,
  button,
}: {
  lang: Lang;
  text: string;
  button: string;
}) {
  const pathname = usePathname();
  const home = `/${lang}`;
  const onHome = pathname === home || pathname === `${home}/`;
  const [shown, setShown] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const vh = window.innerHeight;
      // Past most of the first screen on the homepage; straight away elsewhere.
      const pastHero = onHome ? window.scrollY > vh * 0.7 : true;
      const form = document.getElementById("contact");
      const box = form?.getBoundingClientRect();
      const formInView = box ? box.top < vh * 0.85 && box.bottom > vh * 0.15 : false;
      setShown(pastHero && !formInView);
    };
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onHome, pathname]);

  const href = onHome ? "#contact" : `${home}#contact`;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 flex justify-center px-4"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom))",
        zIndex: "var(--z-sticky)",
      }}
    >
      <div
        aria-hidden={!shown}
        className="glass flex items-center gap-2 rounded-[var(--radius-pill)] p-1.5 pl-5 shadow-[0_18px_50px_oklch(0.06_0.02_264/0.55)] transition-[transform,opacity] duration-500 ease-[var(--ease-out)] motion-reduce:transition-opacity"
        style={{
          transform: shown ? "translateY(0)" : "translateY(140%)",
          opacity: shown ? 1 : 0,
          pointerEvents: shown ? "auto" : "none",
        }}
      >
        <span className="hidden text-[14px] text-text-muted sm:inline">{text}</span>
        <Link
          href={href}
          tabIndex={shown ? 0 : -1}
          className="group inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-5 py-2.5 text-[15px] font-medium text-accent-ink transition-[transform,background-color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:bg-accent-bright"
        >
          {button}
          <ArrowRight
            size={16}
            weight="bold"
            className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
