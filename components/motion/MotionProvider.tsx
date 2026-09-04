"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reduced motion, graded rather than absolute.
 *
 * `reducedMotion="user"` was too blunt. Measured in the browser, Framer under
 * that setting does not animate a suppressed property and does not snap it
 * either — it leaves it at its initial value, so an element that fades in from
 * opacity 0 simply never arrives. The CSS block in globals.css had to force the
 * end state to keep the page from rendering blank, which meant a reader who
 * asked for less motion got no feedback at all: no fades, no sequencing,
 * nothing to indicate the page was responding to them.
 *
 * So Framer is told to animate everything, and `prefers-reduced-motion` is
 * honoured in CSS instead, where it can be precise: `transform` and `clip-path`
 * are pinned flat, so nothing travels, scales, wipes or parallaxes — and
 * opacity is left alone, so sections still cross-fade in. Movement is what
 * triggers vestibular discomfort; a fade does not.
 *
 * Scroll-linked values are bound straight to a MotionValue rather than tweened,
 * so Framer could never have suppressed them anyway. They are neutralised by
 * the same CSS.
 */
export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="never">{children}</MotionConfig>
);
