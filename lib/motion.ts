import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language.
 *
 * Two curves, not one. Everything on the page uses the same pair, so the site
 * has a recognisable way of moving rather than a per-component accident:
 *
 *   easePremium — the workhorse. A weighted ease-out for translate and fade.
 *   easeExpo    — sharper, longer tail. Used where something is *uncovered*
 *                 (image wipes, headline masks) so the reveal arrives fast and
 *                 settles slowly, the way a cut in film does.
 *
 * No bounce, no elastic, no spring: both curves are monotonic, so nothing on
 * the page ever overshoots.
 */

export const easePremium = [0.22, 1, 0.36, 1] as const;
export const easeExpo = [0.16, 1, 0.3, 1] as const;

/**
 * 0.8s — the cinematic end of the range, paired with a viewport margin that
 * fires on entry rather than 12% in. The earlier lateness came from the margin,
 * not the duration, so the reveal can afford to be slow and still feel prompt.
 */
export const baseTransition: Transition = {
  duration: 0.8,
  ease: easePremium,
};

/** Longer, for anything that uncovers rather than moves. */
export const revealTransition: Transition = {
  duration: 1.1,
  ease: easeExpo,
};

/** Standard section reveal — opacity plus a short upward translate. */
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
    transition: { duration: 0.72, ease: easeExpo },
  },
};

/** Line-by-line mask reveal — the same gesture at a slower beat. */
export const lineMask: Variants = {
  hidden: { y: "108%" },
  visible: {
    y: "0%",
    transition: { duration: 0.95, ease: easeExpo },
  },
};

/**
 * Section labels open out of tight tracking as they fade in. Letter-spacing is
 * not a compositor property, but this runs once, on eight characters, at the
 * moment a band enters — the cost is a single layout pass and it is the one
 * gesture that reads as typographic rather than as movement.
 */
export const labelReveal: Variants = {
  hidden: { opacity: 0, letterSpacing: "0.5em" },
  visible: {
    opacity: 1,
    letterSpacing: "0.32em",
    transition: { duration: 1, ease: easeExpo },
  },
};

/**
 * Viewport settings used by every scroll-triggered section. The margin fires
 * the reveal as the element enters rather than 12% after it, which is what made
 * reveals feel late.
 */
export const viewportOnce = { once: true, margin: "0px 0px -5% 0px" } as const;

/**
 * For elements deep inside a band that would otherwise still be waiting when
 * the reader reaches them — fires a little before they cross the edge.
 */
export const viewportEarly = { once: true, margin: "0px 0px 8% 0px" } as const;
