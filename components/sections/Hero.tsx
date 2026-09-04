"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { LinesReveal } from "@/components/motion/LinesReveal";
import { MouseParallax } from "@/components/motion/MouseParallax";
import { ButtonLink } from "@/components/ui/Button";
import { easeExpo, easePremium } from "@/lib/motion";

type HeroProps = {
  /** Rendered on the server so the photograph never enters the client bundle */
  media: ReactNode;
};

/**
 * The photograph is the environment; the type lives inside it.
 *
 * The still life fills the whole opening screen and the words sit in its upper
 * third, over the smoke above the bowls. That placement is not a preference,
 * it is the only region available: the three bowls span 8%–96% of the frame
 * width and 38%–72% of its height, so there is no vertical column anywhere
 * beside them for type to occupy. Setting the words to the left of the picture
 * would put them across the pepper. Above it, they are over ground the
 * photographer already left empty.
 *
 * Which is also why the only scrim is at the top and dies out by 38% — it
 * lands entirely on that empty smoke and never touches a product. There is no
 * left-hand scrim at all: the type does not need one where it sits, and any
 * gradient wide enough to reach it would have shaded the pepper bowl.
 *
 * Scroll gives the frame three speeds: the photograph drifts down and grows
 * very slightly, the scrim holds, and the type leaves upward faster than
 * either. Layered speeds are what make a still photograph read as depth.
 */
const LINES = ["Premium Indian coffee and spices,", "sourced for global markets."];

export const Hero = ({ media }: HeroProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.09]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-46%"]);
  const typeFade = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950"
    >
      {/* ------------------------------------------------- environment -----
        Below xl the photograph is a band under the type; from xl it fills the
        section behind it. The switch is not a stylistic preference — it is the
        crop. `object-cover` on a section taller than the picture's own 16:9
        has to trim width, and at 1024 that measured 44px off the pepper bowl
        and 98px off the coffee. The overlay composition only becomes safe once
        the viewport is wide enough that the section is the shallower of the
        two, which happens at about 1240px.
      */}
      <motion.div
        data-parallax-layer
        style={{ y: bgY, scale: bgScale }}
        className="order-2 aspect-[16/9] w-full shrink-0 xl:absolute xl:inset-0 xl:order-none xl:aspect-auto"
      >
        <motion.div
          data-reveal
          className="h-full w-full"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.1, ease: easeExpo }}
        >
          <MouseParallax strength={14}>{media}</MouseParallax>
        </motion.div>
      </motion.div>

      {/*
        One scrim, top only, fully transparent by 38% of the screen — which is
        where the nearest bowl rim begins. Nothing is laid over a product.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[38%] bg-[linear-gradient(to_bottom,rgba(16,35,27,0.8)_0%,rgba(16,35,27,0.56)_38%,rgba(16,35,27,0.2)_74%,rgba(16,35,27,0)_100%)] xl:block"
      />

      {/* ------------------------------------------------------- type ------ */}
      <motion.div
        data-scroll-fade
        style={{ y: typeY, opacity: typeFade }}
        className="relative z-10 order-1 flex flex-1 items-end pt-24 pb-8 xl:order-none xl:block xl:flex-none xl:pt-[clamp(5.25rem,9.5vh,7rem)] xl:pb-0"
      >
        <div className="container-x w-full">
          <LabelReveal tone="dark" onLoad delay={0.55}>
            India · Western Ghats
          </LabelReveal>

          <LinesReveal
            as="h1"
            lines={LINES}
            onLoad
            delay={0.72}
            step={0.11}
            accentLines={[1]}
            className="mt-[clamp(0.6rem,1.1vw,1.3rem)] max-w-[min(42rem,60vw)] font-display text-[clamp(1.5rem,2.15vw,2.9rem)] leading-[1.07] tracking-[-0.015em] text-cream-50"
          />

          {/*
            Supporting line and controls share a row from sm up, rather than
            stacking. Stacked, the block ran 11px past the pepper bowl's rim at
            1280 — measured, not estimated — and the fix has to come out of
            height, because there is nowhere lower for the type to go. Side by
            side the same content costs one row instead of three.
          */}
          <div className="mt-[clamp(0.7rem,1.15vw,1.3rem)] flex max-w-[min(48rem,66vw)] flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <motion.p
              data-reveal
              className="max-w-[min(24rem,32vw)] text-[clamp(0.8125rem,0.95vw,1.0625rem)] leading-[1.6] text-muted-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePremium, delay: 1.14 }}
            >
              Reliable sourcing, consistent quality and export-ready supply for
              international buyers.
            </motion.p>

            <motion.div
              data-reveal
              className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePremium, delay: 1.3 }}
            >
              <ButtonLink href="/contact#quote" withArrow>
                Request a Quote
              </ButtonLink>
              <ButtonLink href="/products" variant="ghostDark">
                Explore products
              </ButtonLink>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
