"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Which step of a scrollytelling section the reader is level with.
 *
 * Built on an IntersectionObserver watching a thin band across the middle of
 * the viewport rather than on scroll position: observers are driven by the
 * browser's own layout work, so this costs nothing per frame and needs no raw
 * scroll listener.
 *
 * Steps are found by querying `[data-step]` inside the returned container ref
 * rather than collected through per-item ref callbacks, so registration cannot
 * race the effect that sets the observer up.
 */
export function useStepIndex<T extends HTMLElement>(count: number) {
  const container = useRef<T>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const root = container.current;
    if (!root) return;

    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    if (steps.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const step = Number(entry.target.getAttribute("data-step"));
          if (!Number.isNaN(step)) {
            setIndex((current) => (current === step ? current : step));
          }
        });
      },
      /*
        The bottom inset stops just short of -50% on purpose: -50% on both
        sides collapses the root to zero height, and a zero-height rect never
        reports an intersection.
      */
      { rootMargin: "-50% 0px -49.9% 0px", threshold: 0 },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [count]);

  return { container, index };
}
