"use client";

import { useEffect, useRef } from "react";
import type { Lang } from "@/content";
import { ScrollScenes } from "./ScrollScenes";

/*
  Three small things that belong to the whole page rather than to a section:

  - A skip link, first in tab order, for keyboard and screen reader visitors.
  - A hairline at the top of the screen that fills as the page is read.
  - A light that follows the cursor across any frosted panel, the way a real
    pane of glass catches a lamp. It writes two custom properties onto the one
    panel under the pointer and nothing else, so it costs almost nothing.
*/

const SKIP: Record<Lang, string> = {
  nl: "Naar de inhoud",
  en: "Skip to content",
};

export function PageChrome({ lang }: { lang: Lang }) {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let queued = false;

    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (bar.current) {
        bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress)).toFixed(4)})`;
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const onMove = (event: PointerEvent) => {
      const panel = (event.target as Element | null)?.closest<HTMLElement>(".glass");
      if (!panel) return;
      const box = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${(event.clientX - box.left).toFixed(0)}px`);
      panel.style.setProperty("--my", `${(event.clientY - box.top).toFixed(0)}px`);
      panel.dataset.lit = "true";
    };

    const onLeave = (event: PointerEvent) => {
      const panel = (event.target as Element | null)?.closest<HTMLElement>(".glass");
      if (panel && !panel.contains(event.relatedTarget as Node | null)) {
        delete panel.dataset.lit;
      }
    };

    if (fine) {
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onLeave, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return (
    <>
      <ScrollScenes />
      <a
        href="#main"
        className="fixed left-4 top-4 -translate-y-24 rounded-[var(--radius-pill)] bg-text px-4 py-2.5 text-[14px] font-medium text-canvas-deep transition-transform duration-200 ease-[var(--ease-out)] focus:translate-y-0"
        style={{ zIndex: "var(--z-overlay)" }}
      >
        {SKIP[lang]}
      </a>
      <span
        aria-hidden="true"
        ref={bar}
        className="pointer-events-none fixed inset-x-0 top-0 h-[2px] origin-left bg-accent"
        style={{ transform: "scaleX(0)", zIndex: "var(--z-nav)" }}
      />
    </>
  );
}
