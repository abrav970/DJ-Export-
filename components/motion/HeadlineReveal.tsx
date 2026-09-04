"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ElementType } from "react";
import { cn } from "@/lib/utils";

type HeadlineRevealProps = {
  text: string;
  className?: string;
  as?: ElementType;
  /** Fraction of the sweep already complete when the element is first pinned */
  delay?: number;
  /** "mount" for above-the-fold headlines, "inView" for everything below */
  trigger?: "mount" | "inView";
  /** Words rendered in the bronze accent, matched case-insensitively */
  accentWords?: string[];
};

/**
 * Character sweep for hero and section headlines.
 *
 * Every character starts dimmed and resolves to full strength left-to-right as
 * the headline scrolls up. The sweep is scrubbed — bound to scroll position
 * rather than fired once — so it can be driven backwards, which is what makes
 * it read as a sweep rather than a fade.
 *
 * Reduced motion is handled by CSS (`prefers-reduced-motion` in globals.css
 * resolves every character to full opacity) rather than by branching on
 * `useReducedMotion()` during render, which would emit different markup on the
 * server than on the client and break hydration.
 */

const SWEEP_SPAN = 0.62; // portion of the scroll window spent staggering
const CHAR_WINDOW = 0.3; // how long a single character takes to resolve
const DIMMED = 0.24;

const SweepChar = ({
  char,
  progress,
  start,
  isAccent,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  isAccent: boolean;
}) => {
  const opacity = useTransform(
    progress,
    [start, Math.min(start + CHAR_WINDOW, 1)],
    [DIMMED, 1],
  );

  return (
    <motion.span
      data-sweep-char
      aria-hidden="true"
      style={{ opacity }}
      className={cn("inline-block", isAccent && "text-bronze-500 italic")}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
};

export const HeadlineReveal = ({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  trigger = "mount",
  accentWords = [],
}: HeadlineRevealProps) => {
  const ref = useRef<HTMLElement>(null);

  // Above-the-fold headlines have no scroll distance to sweep against, so they
  // run against the page's own initial scroll instead of the element's.
  const { scrollYProgress } = useScroll(
    trigger === "mount"
      ? { offset: ["start start", "35vh start"] }
      : { target: ref, offset: ["start 0.92", "start 0.42"] },
  );

  // Normalise both sides. The comparison strips punctuation from the text,
  // so an accent word given as "markets." or "India?" could never match and
  // the emphasis silently did nothing.
  const normalise = (word: string) => word.replace(/[^\w&-]/g, "").toLowerCase();
  const accents = accentWords.map(normalise);
  const words = text.split(" ");
  const totalChars = text.length;
  let charIndex = 0;

  return (
    <Tag ref={ref} className={className}>
      {/* The sweep is decorative; assistive tech reads the intact string. */}
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          const isAccent = accents.includes(normalise(word));
          const chars = [...word];
          const isLast = wordIndex === words.length - 1;

          return (
            <span key={`${word}-${wordIndex}`} className="inline-block">
              {chars.map((char, i) => {
                const start =
                  delay + (charIndex++ / Math.max(totalChars, 1)) * SWEEP_SPAN;

                return (
                  <SweepChar
                    key={`${char}-${i}`}
                    char={char}
                    progress={scrollYProgress}
                    start={Math.min(start, 1)}
                    isAccent={isAccent}
                  />
                );
              })}
              {!isLast ? (
                <SweepChar
                  char=" "
                  progress={scrollYProgress}
                  start={Math.min(
                    delay + (charIndex++ / Math.max(totalChars, 1)) * SWEEP_SPAN,
                    1,
                  )}
                  isAccent={false}
                />
              ) : null}
            </span>
          );
        })}
      </span>
    </Tag>
  );
};
