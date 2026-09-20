"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/*
  A button that leans towards the cursor as it gets close.

  Purpose: feedback. It tells you the target is live before you reach it, and
  it is the one place on the page where the interface reaches back.

  The pull is written straight to the wrapper's transform inside rAF rather
  than through React state, because state would re-render the tree on every
  pointer move. The inner element keeps its own classes, so the press scale
  and the magnetic offset never fight over the same transform.
*/

const PULL = 0.32;
const RADIUS = 90;

export function MagneticButton({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const wrapper = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let running = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      element.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

      if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
        element.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy);
      const reach = Math.max(box.width, box.height) / 2 + RADIUS;

      if (distance > reach) {
        if (targetX === 0 && targetY === 0) return;
        targetX = 0;
        targetY = 0;
      } else {
        const falloff = 1 - distance / reach;
        targetX = dx * PULL * falloff;
        targetY = dy * PULL * falloff;
      }
      start();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(frame);
      element.style.transform = "";
    };
  }, []);

  return (
    <span ref={wrapper} className="inline-flex will-change-transform">
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    </span>
  );
}
