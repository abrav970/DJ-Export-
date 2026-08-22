"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";
import { easePremium, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type HeadlineRevealProps = {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** "mount" for above-the-fold headlines, "inView" for everything below */
  trigger?: "mount" | "inView";
  /** Words rendered in the bronze accent, matched case-insensitively */
  accentWords?: string[];
};

/**
 * Word-by-word mask reveal for hero and section headlines. Each word sits in an
 * overflow-hidden span and slides up from behind the mask.
 */
export const HeadlineReveal = ({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  trigger = "mount",
  accentWords = [],
}: HeadlineRevealProps) => {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const accents = accentWords.map((word) => word.toLowerCase());
  const hidden = reduce ? { opacity: 0 } : { y: "110%" };
  const shown = reduce ? { opacity: 1 } : { y: "0%" };

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => {
          const isAccent = accents.includes(
            word.replace(/[^\w&-]/g, "").toLowerCase(),
          );
          const transition = {
            duration: 0.9,
            ease: easePremium,
            delay: delay + index * 0.07,
          };

          return (
            <span key={`${word}-${index}`}>
              <span className="inline-block overflow-hidden align-bottom pb-[0.12em]">
                <motion.span
                  className={cn("inline-block", isAccent && "text-bronze-500 italic")}
                  initial={hidden}
                  {...(trigger === "mount"
                    ? { animate: shown }
                    : { whileInView: shown, viewport: viewportOnce })}
                  transition={transition}
                >
                  {word}
                </motion.span>
              </span>
              {index < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </span>
    </Tag>
  );
};
