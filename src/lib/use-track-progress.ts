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
 * The observer is attached a frame after mount. Attaching it during the
 * hydration pass produced an observer that never delivered a single entry, not
 * even the initial one, while an identical observer created later worked
 * perfectly on the same elements. Waiting for layout to settle avoids it.
 */
export function useStepIndex<T extends HTMLElement>(count: number) {
  const container = useRef<T>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const attach = () => {
      const root = container.current;
      if (!root) return;

      const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
      if (steps.length === 0) return;

      observer = new IntersectionObserver(
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
          A thin band across the middle of the screen. The bottom inset stops
          just short of -50% on purpose: -50% on both sides collapses the root
          to zero height, and a zero-height rect never reports an intersection.
        */
        { rootMargin: "-50% 0px -49.9% 0px", threshold: 0 },
      );

      steps.forEach((step) => observer?.observe(step));
    };

    const frame = requestAnimationFrame(attach);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [count]);

  return { container, index };
}
