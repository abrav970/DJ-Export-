"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/data/company";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section className="bg-cream-50 py-24 lg:py-[var(--spacing-section)]">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions buyers ask first"
              accentWords={["first"]}
              description="If something is not covered here, send the question with your enquiry and we will answer it directly."
            />
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-ink-900/12">
              {faqs.map((faq, index) => {
                const isOpen = open === index;
                return (
                  <li key={faq.question} className="border-b border-ink-900/12">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-trigger-${index}`}
                        className="group flex w-full items-start justify-between gap-8 py-6 text-left"
                      >
                        <span
                          className={cn(
                            "font-display text-[1.375rem] leading-snug transition-colors duration-300 sm:text-2xl",
                            isOpen ? "text-bronze-700" : "text-ink-900 group-hover:text-bronze-700",
                          )}
                        >
                          {faq.question}
                        </span>

                        <span
                          aria-hidden="true"
                          className="relative mt-2 block h-3.5 w-3.5 shrink-0 text-bronze-600"
                        >
                          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                          <span
                            className={cn(
                              "absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[var(--ease-premium)]",
                              isOpen ? "rotate-90 scale-y-0" : "rotate-0",
                            )}
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={`faq-panel-${index}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: reduce ? 0 : 0.45,
                            ease: easePremium,
                            opacity: { duration: reduce ? 0 : 0.3 },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 text-[0.9375rem] leading-[1.8] text-ink-700/85">
                            {faq.answer}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
