"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { ButtonLink } from "@/components/ui/Button";
import { easePremium } from "@/lib/motion";

const trustLabels = ["Indian Origin", "Quality Focused", "Global Supply"];

type HeroProps = {
  /** Rendered on the server so the artwork never enters the client bundle */
  background: ReactNode;
};

export const Hero = ({ background }: HeroProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink-950 pt-32 pb-14 lg:min-h-screen lg:pb-20"
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: imageY, scale: 1.12 }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: easePremium }}
      >
        {background}
      </motion.div>

      {/* Legibility scrim — kept directional so the artwork still reads */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(105deg,rgba(12,11,9,0.94)_0%,rgba(12,11,9,0.72)_38%,rgba(12,11,9,0.28)_72%,rgba(12,11,9,0.55)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,rgba(12,11,9,0.95),transparent)]"
      />

      <motion.div
        className="container-x relative w-full"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-3xl">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easePremium, delay: 0.15 }}
          >
            <span className="h-px w-10 bg-bronze-500" />
            <p className="eyebrow text-bronze-300">
              Coffee · Pepper · Cardamom
            </p>
          </motion.div>

          <HeadlineReveal
            text="Premium Indian Coffee, Pepper & Cardamom for Global Markets"
            accentWords={["Global", "Markets"]}
            delay={0.3}
            className="mt-7 text-[clamp(2.5rem,6.2vw,5rem)] leading-[1.02] text-cream-50"
          />

          <motion.p
            className="mt-8 max-w-xl text-[1.0625rem] leading-[1.8] text-cream-200/80"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easePremium, delay: 0.85 }}
          >
            We supply premium-quality Indian coffee, black pepper and cardamom to
            international buyers, with a focus on quality, consistency and reliable
            export service.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easePremium, delay: 1 }}
          >
            <ButtonLink href="/contact#quote" size="lg" withArrow>
              Request a Quote
            </ButtonLink>
            <ButtonLink href="/products" variant="outline" size="lg">
              Explore Our Products
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-cream-100/12 pt-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: easePremium, delay: 1.2 }}
        >
          {trustLabels.map((label) => (
            <span
              key={label}
              className="flex items-center gap-3 text-[0.6875rem] tracking-[0.28em] text-cream-100/70 uppercase"
            >
              <span className="h-1 w-1 rotate-45 bg-bronze-400" aria-hidden="true" />
              {label}
            </span>
          ))}
          <span className="ml-auto hidden items-center gap-3 text-[0.6875rem] tracking-[0.28em] text-cream-100/45 uppercase lg:flex">
            Scroll
            <motion.span
              className="block h-8 w-px bg-gradient-to-b from-bronze-400 to-transparent"
              animate={reduce ? undefined : { scaleY: [0.3, 1, 0.3], originY: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};
