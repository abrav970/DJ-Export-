"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
 *
 * The style is bound unconditionally so the server and the client render the
 * same markup; `prefers-reduced-motion` in globals.css drops the transform,
 * which also drops the over-scale and leaves the layer exactly `inset-0`.
 */
export const Parallax = ({ children, className, distance = 12 }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}%`, `${distance}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        data-parallax-layer
        className="absolute inset-0"
        style={{ y, scale: 1 + distance / 100 + 0.06 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
