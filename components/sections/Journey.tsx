"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Media } from "@/components/media/Media";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import type { MediaSlot } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Estate → harvest → quality → packing → export, as one passage rather than
 * two sections.
 *
 * Sourcing and shipping used to be separate bands with a hard seam between
 * them, which is exactly why the page read as a stack of blocks. They are one
 * band now, and the band's own background travels sand → olive → moss → forest
 * → deep forest as the reader descends, so the light changes continuously and
 * there is no boundary to notice.
 *
 * The photograph is sticky and the text steps past it. That is what makes it a
 * journey rather than five pictures: the reader stays in one frame while the
 * subject inside it advances, and the frame drifts slightly against the scroll
 * so it is never quite inert. The last two stages — packing, then loaded and
 * documented — run straight into the closing crossing below without a band
 * change, so the shipment is followed rather than announced twice.
 *
 * The crossfades are CSS transitions, not JS animations. Under
 * prefers-reduced-motion the global rule collapses transition-duration, so the
 * stages switch instantly instead of dissolving — correct behaviour, no branch.
 * Below lg the panel is not sticky: pinning a viewport-height image on a phone
 * traps the reader rather than guiding them.
 */

type Stage = {
  id: string;
  label: string;
  title: string;
  body: string;
  slot: MediaSlot;
};

const STAGES: Stage[] = [
  {
    id: "estate",
    label: "Origin",
    title: "It starts on the hillside",
    body: "Coffee, black pepper and cardamom from the hill districts of southern India — where altitude, shade and monsoon give the crop its character.",
    slot: "plantation",
  },
  {
    id: "harvest",
    label: "Selection",
    title: "Chosen lot by lot",
    body: "Lots are selected at estate and curing-house level against the grade and specification agreed with the buyer, then cleaned, graded and checked for moisture.",
    slot: "harvest",
  },
  {
    id: "quality",
    label: "Quality",
    title: "Nothing leaves unchecked",
    body: "Cleaning, grading and moisture checks, with samples shared for approval before a lot is confirmed for shipment.",
    slot: "inspection",
  },
  {
    id: "packing",
    label: "Packing",
    title: "Prepared for the voyage",
    body: "Food-grade packing chosen for the commodity and the route, palletised and marked to your instructions.",
    slot: "packing",
  },
  {
    id: "export",
    label: "Export",
    title: "Loaded and documented",
    body: "Documentation prepared, container stuffed and dispatched, with shipment details shared through to arrival.",
    slot: "logistics",
  },
];

export const Journey = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The held frame drifts a few percent across the whole passage. Nothing moves
  // behind it, so this is not parallax in the usual sense — it is what stops a
  // sticky element that never translates from reading as a paused video.
  const frameY = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(STAGES.length - 1, Math.max(0, Math.floor(p * STAGES.length)));
    setActive((current) => (current === next ? current : next));
  });

  return (
    <section
      /*
        One continuous change of light — but the mid-tones are spent in the gap
        between stage two and stage three, not under a stage. Moss and olive are
        beautiful and unusable as a text ground: cream clears only 3.6:1 on moss
        and deep forest only 4.0:1, so a stage sitting there fails either way.

        Measured against the real stage positions: stages sit at 15%, 32%, 51%,
        68% and 86%, so the ground is held flat sand to 36% and flat forest from
        48%, and the whole tonal move happens in the 370px gap between stage two
        and stage three. Body copy then reads 4.75:1 on the sand and 7.2:1 on
        the forest, with nothing stranded on the mid-tones.
      */
      className="relative bg-[linear-gradient(to_bottom,#e6ddcb_0%,#e6ddcb_36%,#a8ad7c_40%,#4a5e46_44%,#10231b_48%,#10231b_100%)]"
    >
      <div className="container-x pt-[var(--spacing-section)]">
        <div className="max-w-2xl">
          <LabelReveal>From the source</LabelReveal>
          <HeadingReveal
            text="We start where it grows"
            accentWords={["grows"]}
            delay={0.08}
            className="mt-6 font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.1] tracking-[-0.01em] text-ink-950"
          />
        </div>
      </div>

      {/* ------------------------------------------------ desktop: sticky ---- */}
      <div ref={ref} className="relative mt-16 hidden lg:block">
        <div className="container-x">
          <div className="grid grid-cols-12 gap-16">
            {/* Text steps past the frame */}
            <div className="col-span-5">
              {STAGES.map((stage, index) => {
                const light = index <= 1;

                return (
                  <div
                    key={stage.id}
                    className="flex min-h-[74svh] flex-col justify-center"
                    aria-current={index === active ? "step" : undefined}
                  >
                    <LabelReveal rule={false} tone={light ? "light" : "dark"}>
                      {stage.label}
                    </LabelReveal>

                    <HeadingReveal
                      as="h3"
                      text={stage.title}
                      accentWords={[]}
                      delay={0.06}
                      className={cn(
                        "mt-5 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.1] tracking-[-0.01em]",
                        light ? "text-ink-950" : "text-cream-50",
                      )}
                    />

                    <Reveal delay={0.16}>
                      <p
                        className={cn(
                          "mt-5 max-w-sm text-[1.0625rem] leading-[1.8]",
                          light ? "text-muted-light" : "text-muted-dark",
                        )}
                      >
                        {stage.body}
                      </p>
                    </Reveal>
                  </div>
                );
              })}
            </div>

            {/* One frame, held; the subject inside it advances */}
            <div className="col-span-7">
              <div className="sticky top-0 flex h-screen items-center">
                <div className="relative aspect-[4/5] max-h-[76svh] w-full overflow-hidden rounded-[var(--radius-tile)]">
                  {/* Inset by the drift distance so no edge is ever exposed. */}
                  <motion.div
                    data-parallax-layer
                    style={{ y: frameY }}
                    className="absolute inset-[-3%]"
                  >
                    {STAGES.map((stage, index) => (
                      <div
                        key={stage.id}
                        aria-hidden={index !== active}
                        className={cn(
                          "absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-[var(--ease-premium)]",
                          index === active ? "scale-100 opacity-100" : "scale-[1.05] opacity-0",
                        )}
                      >
                        <Media slot={stage.slot} sizes="58vw" tone="dark" />
                      </div>
                    ))}
                  </motion.div>

                  {/* Progress, as a hairline rather than a widget */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 flex gap-1.5 p-5"
                  >
                    {STAGES.map((stage, index) => (
                      <span key={stage.id} className="h-px flex-1 overflow-hidden bg-cream-50/25">
                        <span
                          className={cn(
                            "block h-full w-full origin-left bg-bronze-300 transition-transform duration-700 ease-[var(--ease-premium)]",
                            index <= active ? "scale-x-100" : "scale-x-0",
                          )}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- mobile: stacked --- */}
      <ol className="container-x mt-12 space-y-14 lg:hidden">
        {STAGES.map((stage, index) => {
          const light = index <= 1;

          return (
            <li key={stage.id}>
              <RevealImage
                className="rounded-[var(--radius-tile)]"
                from={index % 2 === 0 ? "left" : "right"}
                scale={1.12}
              >
                <div className="aspect-[4/3] w-full">
                  <Media slot={stage.slot} sizes="100vw" tone="dark" />
                </div>
              </RevealImage>

              <LabelReveal
                rule={false}
                tone={light ? "light" : "dark"}
                className="mt-6"
                delay={0.1}
              >
                {stage.label}
              </LabelReveal>

              <HeadingReveal
                as="h3"
                text={stage.title}
                accentWords={[]}
                delay={0.16}
                className={cn(
                  "mt-3 font-display text-[1.85rem] leading-tight",
                  light ? "text-ink-950" : "text-cream-50",
                )}
              />

              <Reveal delay={0.24}>
                <p
                  className={cn(
                    "mt-3 text-[0.9375rem] leading-[1.75]",
                    light ? "text-muted-light" : "text-muted-dark",
                  )}
                >
                  {stage.body}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <div className="h-[var(--spacing-section)]" />
    </section>
  );
};
