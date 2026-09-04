"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ElementType } from "react";
import { baseTransition, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Travel distance in px — set to 0 for elements that must not shift */
  y?: number;
  as?: ElementType;
};

/**
 * The site's default scroll reveal: opacity plus a short upward translate,
 * fired once when the element enters the viewport.
 *
 * Reduced motion is handled by <MotionProvider> rather than by branching here —
 * see the note in that file for why reading it during render breaks hydration.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: RevealProps) => {
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...baseTransition, delay }}
    >
      {children}
    </MotionTag>
  );
};
