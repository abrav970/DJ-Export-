"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Total travel as a percentage of the element height */
  distance?: number;
};

/**
 * Moves large imagery slightly slower than the page. Only `transform` is
 * animated, and the inner layer is over-sized so no edge is ever exposed.
 */
export const Parallax = ({ children, className, distance = 12 }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}%`, `${distance}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale: 1 + distance / 100 + 0.06 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
