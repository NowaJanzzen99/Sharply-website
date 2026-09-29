"use client";

import { useId, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { Reveal, RevealLines } from "../Reveal";

/*
  The questions at the foot of a service page.

  Opening is a state change, so it animates: the answer grows out of nothing
  and the plus turns into a minus. The height runs on grid-template-rows going
  from 0fr to 1fr, which is the one way to transition to "as tall as the
  content is" without measuring anything in JavaScript and without an animated
  height forcing layout on every frame.

  One question open at a time. They are alternatives to each other, and a list
  where everything is open is just a wall of text with lines through it.
*/

type Item = { question: string; answer: string };

export function DetailQuestions({ title, items }: { title: string; items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId().replace(/:/g, "");

  return (
    <section className="border-t border-hairline py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium text-text md:col-span-4">
            <RevealLines lines={[title]} onView />
          </h2>

          <div className="md:col-span-8">
            <Reveal>
              <ul className="flex flex-col">
                {items.map((item, index) => {
                  const isOpen = open === index;
                  const panelId = `${uid}-answer-${index}`;

                  return (
                    <li key={item.question} className="border-t border-hairline last:border-b">
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-200 ease-out hover-fine:hover:text-text"
                        >
                          <span className="font-display text-[18px] font-medium text-text md:text-[20px]">
                            {item.question}
                          </span>
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-hairline-strong text-text-muted transition-[transform,border-color,color] duration-300 ease-[var(--ease-out)]"
                            style={{
                              transform: isOpen ? "rotate(135deg)" : "rotate(0deg)",
                              borderColor: isOpen ? "var(--accent)" : undefined,
                              color: isOpen ? "var(--accent-bright)" : undefined,
                            }}
                          >
                            <Plus size={14} weight="bold" />
                          </span>
                        </button>
                      </h3>

                      <div
                        id={panelId}
                        role="region"
                        className="grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out)]"
                        style={{
                          gridTemplateRows: isOpen ? "1fr" : "0fr",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-[62ch] pb-7 pr-10 text-[16px] leading-[1.65] text-text-muted">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
