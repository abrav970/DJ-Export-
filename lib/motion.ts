import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language: slow, weighted easing and short travel distances.
 * Every component reads from here so the whole site moves the same way.
 */

export const easePremium = [0.22, 1, 0.36, 1] as const;

export const baseTransition: Transition = {
  duration: 0.8,
  ease: easePremium,
};

/** Standard section reveal — opacity + a small upward translate. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition },
};

/** Parent container that releases children one after another. */
export const stagger = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Word-by-word headline mask reveal. */
export const wordMask: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: easePremium },
  },
};

/** Viewport settings used by every scroll-triggered section. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
