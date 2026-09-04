"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import { lineMask, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LinesRevealProps = {
  /** One entry per rendered line. The break is authored, not measured. */
  lines: string[];
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Beat between lines. */
  step?: number;
  /** Indices of lines rendered in the accent colour. */
  accentLines?: number[];
  accentClassName?: string;
  /** Fires on mount rather than on scroll — used by the hero. */
  onLoad?: boolean;
};

/**
 * Line-by-line mask reveal for large type.
 *
 * A heading animated as one object is a block that fades; a heading animated
 * line by line is writing that arrives. Each line sits in its own overflow
 * clip and rises from beneath it, one beat after the last.
 *
 * The lines are authored rather than measured, which is the point: the writer
 * decides where the headline breaks, and the break survives a resize because
 * the element is still a normal block of text — the clip just travels with it.
 */
export const LinesReveal = ({
  lines,
  className,
  as: Tag = "h2",
  delay = 0,
  step = 0.1,
  accentLines = [],
  accentClassName = "text-bronze-300 italic",
  onLoad = false,
}: LinesRevealProps) => {
  const MotionTag = motion[Tag as "h2"];
  const trigger = onLoad
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: viewportOnce };

  return (
    <MotionTag
      className={className}
      variants={stagger(step, delay)}
      initial="hidden"
      {...trigger}
    >
      {lines.map((line, index) => (
        // pb/-mb pair: the clip closes on the baseline, so descenders need
        // room underneath it that costs no layout height.
        <span
          key={`${line}-${index}`}
          className="block overflow-hidden pb-[0.12em] [margin-bottom:-0.12em]"
        >
          <motion.span
            data-reveal
            variants={lineMask}
            className={cn("block", accentLines.includes(index) && accentClassName)}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};
