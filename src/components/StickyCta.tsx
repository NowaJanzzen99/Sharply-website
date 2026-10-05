"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import type { Lang } from "@/content";

/*
  The glass pill at the foot of the screen: one way into the form, always in
  reach, wherever someone is on the site. The whole pill is the button, and it
  carries one line, so it reads at a glance and never competes with the page.

  It steps aside twice, on purpose. Over the first screen of the homepage the
  hero already carries the same button, and two identical calls to action on
  one screen read as pushy, so the pill rises once the hero has been scrolled
  past. And once the form itself is on screen there is nothing left to point
  at, so it sinks away again. Everywhere else it stays.

  Phones only. On a wide screen the navigation bar is always in view and
  carries the same button, and two of them on one screen read as pushy.

  It moves on transform and opacity only, and sits above the device's own
  home indicator on phones (env(safe-area-inset-bottom)).
*/
export function StickyCta({ lang, label }: { lang: Lang; label: string }) {
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
      className="pointer-events-none fixed inset-x-0 flex justify-center px-4 md:hidden"
      style={{
        bottom: "max(18px, env(safe-area-inset-bottom))",
        zIndex: "var(--z-sticky)",
      }}
    >
      <Link
        href={href}
        aria-hidden={!shown}
        tabIndex={shown ? 0 : -1}
        className="pill group flex h-14 items-center gap-5 rounded-[var(--radius-pill)] pl-7 pr-2 text-[16px] font-medium text-text transition-[transform,opacity,filter] duration-500 ease-[var(--ease-out)] active:scale-[0.97] hover-fine:hover:brightness-125 motion-reduce:transition-opacity"
        style={{
          transform: shown ? "translateY(0)" : "translateY(160%)",
          opacity: shown ? 1 : 0,
          pointerEvents: shown ? "auto" : "none",
        }}
      >
        {label}
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_0_22px_oklch(0.64_0.178_259/0.55)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5"
        >
          <ArrowRight size={17} weight="bold" />
        </span>
      </Link>
    </div>
  );
}
