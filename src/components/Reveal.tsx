"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/*
  Reveals run on CSS transitions rather than JS.
  Three reasons: they stay smooth while the page is still loading work onto the
  main thread, the hidden state renders identically on the server and the client,
  and prefers-reduced-motion is handled by the stylesheet instead of a branch in
  render (which is what makes Motion's initial styles mismatch on hydration).
*/

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "span";
};

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal={shown ? "in" : "out"}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Headline that assembles itself line by line, clipping up from behind a mask.
 * Runs on mount, not on scroll: each line starts fully outside its own
 * overflow-hidden box, so an intersection observer would never see it.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <span
            data-line={shown ? "in" : "out"}
            style={{ transitionDelay: `${index * 0.08}s` }}
            className={`block ${lineClassName ?? ""}`}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
