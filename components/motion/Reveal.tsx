"use client";

import { motion, useReducedMotion } from "framer-motion";
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
 * fired once when the element enters the viewport. Honours reduced motion.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: RevealProps) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...baseTransition, delay }}
    >
      {children}
    </MotionTag>
  );
};
