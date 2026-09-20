"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/*
  Reveals run on CSS transitions rather than JS.
  Three reasons: they stay smooth while the page is still loading work onto the
  main thread, the hidden state renders identically on the server and the client,
  and prefers-reduced-motion is handled by the stylesheet instead of a branch in
  render (which is what makes Motion's initial styles mismatch on hydration).

  Each export is a different entrance, on purpose. One reveal used everywhere is
  what makes a page read as a template.
*/

function useInViewOnce<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
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
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, shown };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "span";
};

/** Body copy and blocks: a short rise. The quiet default. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const { ref, shown } = useInViewOnce<HTMLElement>();
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
 * Headings: each line clips up from behind its own mask, which reads as print
 * rather than as text fading in. The observer sits on the unclipped wrapper,
 * because the line itself starts fully outside its overflow-hidden box and an
 * observer watching it would never fire.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  onView = false,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  /** Trigger on scroll instead of on mount. */
  onView?: boolean;
}) {
  const { ref, shown: inView } = useInViewOnce<HTMLSpanElement>(0.4);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (onView) return;
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [onView]);

  const shown = onView ? inView : mounted;

  return (
    <span ref={ref} className={className}>
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

/** Images: a curtain opens upward while the picture settles out of a slight zoom. */
export function RevealImage({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, shown } = useInViewOnce<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      data-img-reveal={shown ? "in" : "out"}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}

/** Grouped items: a cascade, 55ms apart. */
export function RevealStagger({
  children,
  className,
  as = "ul",
}: {
  children: ReactNode;
  className?: string;
  as?: "ul" | "div";
}) {
  const { ref, shown } = useInViewOnce<HTMLElement>(0.25);
  const Tag = as;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-stagger={shown ? "in" : "out"}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Splits a heading into lines at sentence or comma breaks for the mask reveal. */
export function splitHeading(text: string): string[] {
  const parts = text.split(/(?<=[.:])\s+/).filter(Boolean);
  return parts.length > 1 ? parts : [text];
}
