"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { LinesReveal } from "@/components/motion/LinesReveal";
import { TextLink } from "@/components/ui/Button";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type StageItem = {
  slug: string;
  name: string;
  tagline: string;
  meta: string;
  /** Crop-in-context frame, rendered on the server */
  wide: ReactNode;
  /** Macro of the finished product, rendered on the server */
  inset: ReactNode;
};

/**
 * The range as a held frame: one editorial spread that changes subject.
 *
 * The three products used to be three spreads stacked down the page, which the
 * reader scrolled past. Here the spread is pinned and the *product* moves
 * through it — the wide frame cross-dissolves, the macro follows a beat later
 * on its own easing, and the type is remounted so its lines rise again for each
 * commodity rather than being swapped as a block.
 *
 * The layout is deliberately the one it replaces: wide frame, macro overlapping
 * its corner on a keyline mount, type beside it. What changed is that the
 * reader now stands still while the range passes, which is the difference
 * between a catalogue and a showcase.
 *
 * Pinning is done with `position: sticky` over a tall spacer rather than by
 * rewriting the scroll position. Nothing is hijacked: the scrollbar keeps its
 * true length, a flick still travels the distance it should, and the whole
 * section is three screens for three products — the reader is never held in
 * one place watching an animation finish.
 *
 * Below lg this component is not rendered at all; the stacked spreads are.
 * Pinning a viewport-height stage on a phone is how a page stops feeling
 * scrollable.
 */
export const ProductStage = ({ items }: { items: StageItem[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // A slow, continuous grow across the whole passage, under the per-product
  // cross-dissolve. It is what stops a held frame reading as a static panel
  // between transitions.
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const insetY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(items.length - 1, Math.max(0, Math.floor(p * items.length)));
    setActive((current) => (current === next ? current : next));
  });

  const current = items[active];

  return (
    <div
      ref={ref}
      className="relative hidden lg:block"
      style={{ height: `${items.length * 92}svh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container-x w-full">
          <div className="grid grid-cols-12 items-center gap-16">
            {/* ---------------------------------------------------- imagery */}
            <div className="relative col-span-7">
              <motion.div
                data-parallax-layer
                style={{ scale: frameScale }}
                className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-tile)]"
              >
                {items.map((item, index) => (
                  <div
                    key={item.slug}
                    aria-hidden={index !== active}
                    className={cn(
                      "absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-[var(--ease-premium)]",
                      index === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                    )}
                  >
                    {item.wide}
                  </div>
                ))}
              </motion.div>

              {/*
                The macro trails the wide frame: a longer duration and its own
                drift, so the pair arrives as two layers at two speeds instead
                of one card sliding into place.
              */}
              <motion.div
                data-parallax-layer
                style={{ y: insetY }}
                className="absolute right-[-3rem] bottom-[-3rem] w-[29%] max-w-[11.5rem]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] ring-[5px] ring-cream-50">
                  {items.map((item, index) => (
                    <div
                      key={item.slug}
                      aria-hidden={index !== active}
                      className={cn(
                        "absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[var(--ease-premium)]",
                        index === active
                          ? "translate-y-0 opacity-100"
                          : "translate-y-3 opacity-0",
                      )}
                    >
                      {item.inset}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ------------------------------------------------------- type */}
            <div className="relative col-span-5 min-h-[19rem]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.slug}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.35, ease: easePremium } }}
                >
                  <LabelReveal rule={false} onLoad>
                    {current.meta}
                  </LabelReveal>

                  <LinesReveal
                    as="h3"
                    lines={[current.name]}
                    onLoad
                    delay={0.08}
                    className="mt-5 font-display text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.06] tracking-[-0.01em] text-ink-950"
                  />

                  <motion.p
                    data-reveal
                    className="mt-5 max-w-sm text-[1.0625rem] leading-[1.8] text-muted-light"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easePremium, delay: 0.24 }}
                  >
                    {current.tagline}
                  </motion.p>

                  <motion.div
                    data-reveal
                    className="mt-8"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easePremium, delay: 0.34 }}
                  >
                    <TextLink href={`/products/${current.slug}`} className="text-ink-950">
                      View product
                    </TextLink>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/*
                The rail names the range rather than numbering it. Three
                commodities are a set, not a sequence, so 01/02/03 would assert
                an order the reader does not need — but the names double as the
                reader's position in the passage.
              */}
              <ul className="absolute inset-x-0 bottom-0 flex gap-6" aria-hidden="true">
                {items.map((item, index) => (
                  <li
                    key={item.slug}
                    className={cn(
                      "text-[0.6875rem] tracking-[0.2em] uppercase transition-colors duration-700",
                      index === active ? "text-bronze-700" : "text-ink-900/35",
                    )}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
