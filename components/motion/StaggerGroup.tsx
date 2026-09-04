"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { baseTransition, stagger, viewportOnce } from "@/lib/motion";

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  /** Element to render, so lists and definition lists keep their semantics */
  as?: ElementType;
};

/** Parent that releases its <StaggerItem> children one after another. */
export const StaggerGroup = ({
  children,
  className,
  step = 0.12,
  delay = 0,
  as = "div",
}: StaggerGroupProps) => {
  const MotionTag = motion[as as "div"];

  return (
  <MotionTag
    className={className}
    variants={stagger(step, delay)}
    initial="hidden"
    whileInView="visible"
    viewport={viewportOnce}
  >
    {children}
  </MotionTag>
  );
};

export const StaggerItem = ({
  children,
  className,
  y = 26,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: ElementType;
}) => {
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag
      data-reveal
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: baseTransition },
      }}
    >
      {children}
    </MotionTag>
  );
};
