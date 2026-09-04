"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeExpo, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealImageProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Edge the mask opens from. Varied per section so the page is not one trick. */
  from?: "left" | "right" | "bottom" | "top";
  /** Over-scale the photograph settles back from. */
  scale?: number;
};

/**
 * Editorial image reveal: the frame wipes open while the photograph inside
 * settles back from a slight over-scale, so the picture appears to be
 * uncovered rather than faded in.
 *
 * Two elements, because a clip-path on the same node as a transform would
 * fight: the outer node carries the wipe, the inner one the scale. The inner
 * scale runs longer than the wipe on purpose — the frame finishes first and
 * the image is still settling, which is what stops the pair reading as one
 * mechanical gesture.
 *
 * data-reveal is what the prefers-reduced-motion block in globals.css keys on —
 * it resolves both halves to their finished state, since a clip-path that never
 * animates would otherwise leave the image permanently hidden.
 */
const closedFor = {
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  bottom: "inset(100% 0 0 0)",
  top: "inset(0 0 100% 0)",
} as const;

export const RevealImage = ({
  children,
  className,
  delay = 0,
  from = "left",
  scale = 1.1,
}: RevealImageProps) => (
  <motion.div
    data-reveal
    className={cn("overflow-hidden", className)}
    initial={{ clipPath: closedFor[from] }}
    whileInView={{ clipPath: "inset(0 0 0 0)" }}
    viewport={viewportOnce}
    transition={{ duration: 1.15, ease: easeExpo, delay }}
  >
    <motion.div
      data-reveal
      className="h-full w-full"
      initial={{ scale }}
      whileInView={{ scale: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 1.7, ease: easeExpo, delay }}
    >
      {children}
    </motion.div>
  </motion.div>
);
