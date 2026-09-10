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

/**
 * The floor of the sweep — and the reason this file has a contrast note.
 *
 * This was 0.24, which is a fine number for a decorative shimmer and a bad one
 * for the only <h1> on the page. Because `trigger="mount"` binds the sweep to
 * the document's own scroll from 0 to 35vh, the headline is at the floor
 * *exactly when the page loads* and only reaches full strength once the reader
 * has scrolled it half off the screen. The dimmest frame is the first
 * impression, which is backwards.
 *
 * Measured on /products at scroll 0, composited over the actual photograph and
 * both hero scrims: cream-50 at 0.24 lands on rgb(78,85,76) for a contrast
 * ratio between 1.40:1 and 2.01:1. AA wants 3:1 for text this size. A 60px
 * heading was failing the large-text threshold by half.
 *
 * 0.72 is the floor that keeps the worst character above 7:1 on the darkened
 * plate (see the gradient note in PageHero, which was re-measured with it).
 * The sweep survives: 0.72 → 1.0 is a ~23-point travel in L*, which on cream
 * over deep forest still reads as a brightness wave crossing the line. What
 * does not survive is the state where the headline was not there at all.
 */
const DIMMED = 0.72;

/**
 * The accent needs its own floor, and the reason is arithmetic rather than
 * taste: one opacity applied to two colours does not buy the same legibility
 * twice. Fading toward the backdrop costs a dark colour proportionally more of
 * its remaining contrast than a light one, so the gold reached 4.05:1 at the
 * same 0.72 that put the ivory at 7.7:1 — the emphasis word was the least
 * readable thing in the sentence it was there to emphasise.
 *
 * 0.86 lands bronze-400 at 5.43:1, clear of the 4.5:1 AAA threshold for text
 * this size. The shorter travel is not a compromise: the two floors are picked
 * so both colours move by a *similar perceived* amount, which is what makes the
 * sweep cross an accented headline evenly instead of visibly stalling on the
 * italic word.
 */
const DIMMED_ACCENT = 0.86;

/**
 * bronze-400 rather than bronze-500 for the accent. The accent is the one part
 * of the headline allowed to sit below the ivory, but 500 (#b08f4e) measured
 * 5.2:1 — *darker than the eyebrow above it* at 9.4:1 — which inverted the
 * hierarchy inside the title itself. 400 (#c5a86a) measures 7.2:1: still
 * unmistakably gold against the cream, still clearly subordinate to it.
 */
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
    [isAccent ? DIMMED_ACCENT : DIMMED, 1],
  );

  return (
    <motion.span
      data-sweep-char
      aria-hidden="true"
      style={{ opacity }}
      className={cn("inline-block", isAccent && "text-bronze-400 italic")}
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
