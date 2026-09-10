"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import { stagger, wordMask } from "@/lib/motion";
import { cn } from "@/lib/utils";

type HeadingRevealProps = {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  /**
   * Words rendered in the bronze accent, matched case-insensitively and
   * punctuation-insensitively — so "India" matches "India?".
   *
   * One word per entry. Matching is per word, so a multi-word phrase never
   * matches anything and fails silently; pass `["side", "by"]`, not
   * `["side by side"]`.
   */
  accentWords?: string[];
  /**
   * Accent colour for those words. Must follow the band: bronze-500 measures
   * 2.56:1 on cream-100, which fails AA even at display sizes.
   */
  accentClassName?: string;
};

/**
 * Section heading reveal: each word rises out of a mask, once, as the heading
 * enters. One gesture, ~0.6s.
 *
 * This replaces the per-character scroll-scrubbed sweep on section headings.
 * The sweep now runs only on page heroes (see HeadlineReveal) — firing it at
 * fourteen headings per page made it read as an effect demo rather than as
 * authorship, and it cost roughly fifty DOM nodes and fifty MotionValues per
 * heading.
 *
 * The words keep real spaces between them, so assistive technology reads the
 * heading normally and no sr-only duplicate is needed.
 */
export const HeadingReveal = ({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  accentWords = [],
  accentClassName = "text-bronze-700 italic",
}: HeadingRevealProps) => {
  const MotionTag = motion[Tag as "h2"];
  // Normalise both sides. The comparison strips punctuation from the text,
  // so an accent word given as "markets." or "India?" could never match and
  // the emphasis silently did nothing.
  const normalise = (word: string) => word.replace(/[^\w&-]/g, "").toLowerCase();
  const accents = accentWords.map(normalise);
  const words = text.split(" ");

  return (
    <MotionTag
      className={className}
      variants={stagger(0.04, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
    >
      {words.map((word, index) => {
        const isAccent = accents.includes(normalise(word));

        return (
          <span key={`${word}-${index}`}>
            {/*
              The mask clips at the baseline, so it needs padding underneath for
              descenders — added and then negated so it costs no layout height.
            */}
            <span className="inline-flex overflow-hidden pb-[0.14em] align-bottom [margin-bottom:-0.14em]">
              <motion.span
                data-reveal
                variants={wordMask}
                className={cn("inline-block", isAccent && accentClassName)}
              >
                {word}
              </motion.span>
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </MotionTag>
  );
};
