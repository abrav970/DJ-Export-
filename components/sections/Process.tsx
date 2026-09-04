"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { Media } from "@/components/media/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/company";
import type { MediaSlot } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Source → Inspect → Prepare → Export.
 *
 * On desktop this pins while the reader scrolls and changes stage as they
 * move: the photograph crossfades, the stage text swaps, the rail
 * fills. After the fourth stage the pin releases and the page continues.
 *
 * Two deliberate implementation choices:
 *
 * 1. The pin is `position: sticky` inside a tall container, not a scroll
 *    library. It costs nothing, cannot desynchronise from the scrollbar, and
 *    degrades to ordinary scrolling if the JS never runs.
 *
 * 2. The crossfades are CSS transitions rather than Framer animations. Under
 *    prefers-reduced-motion the global rule collapses transition-duration to
 *    ~0, so stages switch instantly instead of dissolving — which is the
 *    correct reduced-motion behaviour and needs no JS branch. Driving them with
 *    Framer instead would have required data-reveal, and that rule forces
 *    opacity to 1, which would stack all four photographs on top of each other.
 *
 * Below `lg` the section is a plain stacked list — pinning a viewport-height
 * panel on a phone traps the reader rather than guiding them.
 */

/** Photograph for each stage, in step order. */
const stageMedia: MediaSlot[] = ["harvest", "inspection", "packing", "logistics"];

export const Process = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(processSteps.length - 1, Math.floor(p * processSteps.length));
    setActive((current) => (current === next ? current : Math.max(0, next)));
  });

  return (
    <section className="bg-cream-50">
      <div className="container-x pt-[var(--spacing-section)]">
        <SectionHeading
          eyebrow="How we work"
          title="Source, inspect, prepare, export"
          accentWords={["export"]}
          description="Four stages, handled in sequence and documented, so nothing about a shipment is left to assumption."
        />
      </div>

      {/* ---------------- Desktop: pinned ---------------- */}
      <div
        ref={ref}
        className="relative mt-14 hidden lg:block"
        // 80vh per stage, not 100: each stage still gets a clear beat, but the
        // section stops eating 43% of the page's total scroll distance.
        style={{ height: `${processSteps.length * 80}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="container-x w-full">
            <div className="grid items-center gap-16 lg:grid-cols-12">
              <div className="lg:col-span-5">
                {/* Stage panels are stacked; only the active one is visible. */}
                <div className="relative min-h-[19rem]">
                  {processSteps.map((step, index) => (
                    <div
                      key={step.step}
                      aria-hidden={index !== active}
                      className={cn(
                        "absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-premium)]",
                        index === active
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-3 opacity-0",
                      )}
                    >
                      {/*
                        Ornament, not content: the stage is already named by the
                        h3 below and by the rail's screen-reader label, so this
                        numeral is aria-hidden and exempt from the text contrast
                        minimum it could not meet at this weight.
                      */}
                      <span
                        aria-hidden="true"
                        className="font-display text-[5rem] leading-none text-bronze-600/45"
                      >
                        {step.step}
                      </span>
                      <h3 className="mt-4 font-display text-[2.5rem] leading-tight text-ink-900">
                        {step.title}
                      </h3>
                      <p className="mt-4 max-w-md text-[1.0625rem] leading-[1.75] text-muted-light">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Progress rail */}
                <ol className="mt-10 flex items-center gap-3">
                  {processSteps.map((step, index) => (
                    <li key={step.step} className="flex-1">
                      <span className="sr-only">
                        {step.title}
                        {index === active ? " (current)" : ""}
                      </span>
                      <span
                        aria-hidden="true"
                        className="block h-px w-full overflow-hidden bg-ink-900/15"
                      >
                        <span
                          className={cn(
                            "block h-full w-full origin-left bg-bronze-600 transition-transform duration-700 ease-[var(--ease-premium)]",
                            index <= active ? "scale-x-100" : "scale-x-0",
                          )}
                        />
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="lg:col-span-7">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-tile)]">
                  {stageMedia.map((slot, index) => (
                    <div
                      key={slot}
                      className={cn(
                        "absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-premium)]",
                        index === active
                          ? "scale-100 opacity-100"
                          : "scale-[1.04] opacity-0",
                      )}
                    >
                      <Media
                        slot={slot}
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        priority={index === 0}
                        tone="dark"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Mobile: stacked ---------------- */}
      <ol className="container-x mt-10 space-y-12 pb-[var(--spacing-section)] lg:hidden">
        {processSteps.map((step, index) => (
          <li key={step.step}>
            <div className="aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-tile)]">
              {/* 0px above lg: this list is display:none there, so the browser
                  should never fetch a desktop-width source for it. */}
              <Media
                slot={stageMedia[index]}
                sizes="(min-width: 1024px) 0px, 100vw"
                tone="dark"
              />
            </div>
            <span
              aria-hidden="true"
              className="mt-5 block font-display text-[2.5rem] leading-none text-bronze-600/45"
            >
              {step.step}
            </span>
            <h3 className="mt-2 font-display text-[1.75rem] leading-tight text-ink-900">
              {step.title}
            </h3>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted-light">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      <div className="hidden pb-[var(--spacing-section)] lg:block" />
    </section>
  );
};
