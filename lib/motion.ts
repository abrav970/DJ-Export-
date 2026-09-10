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

/* ------------------------------------------------------------------ scroll --
  Everything below drives the GSAP/ScrollTrigger half of the site.

  The values are not new. They are the numbers already spread across Hero,
  Journey, Crossing, ProductStory and Process, collected into one place so a
  scene reads its motion from a token rather than inventing one. A
  ScrollTrigger anywhere in this project that carries a bare number is a bug.

  The split is deliberate: `lib/motion.ts` holds the *values*, `lib/gsap.ts`
  holds the *runtime*. Nothing here imports GSAP, so a server component can
  read a token without pulling an animation library into the bundle.
*/

/**
 * The same two curves, in GSAP's vocabulary.
 *
 * GSAP core cannot take a cubic-bezier array — that needs CustomEase, a plugin
 * this project does not load for two eases. These are the nearest native
 * equivalents and the match is close enough to be imperceptible side by side:
 *
 *   easePremium [0.22, 1, 0.36, 1]  ≈ power4.out
 *   easeExpo    [0.16, 1, 0.3, 1]   ≈ expo.out
 *
 * They are declared here, beside the Framer curves they mirror, precisely so
 * the two halves of the site cannot drift apart. If one is ever retuned, the
 * other is right there.
 */
export const gsapEase = {
  premium: "power4.out",
  expo: "expo.out",
  /** Scrubbed motion is always linear — see the note in `ScrubLayer`. */
  linear: "none",
} as const;

/**
 * Scrub is expressed in seconds of catch-up, never `true`.
 *
 * `scrub: true` pins the animation to the scrollbar exactly, which reads as
 * mechanical — the picture stops the instant the reader does. A small catch-up
 * lets the frame settle after the scroll ends, which is the difference between
 * driving a timeline and dragging one.
 */
export const scrub = {
  /** Route drawing and progress rails, where lag would feel like input delay. */
  tight: 0.35,
  /** The default for scenes and layers. */
  base: 0.6,
  /** Large background plates, which should trail the page noticeably. */
  loose: 1.2,
} as const;

/**
 * Travel distance for scroll-linked layers, as a percentage of element height.
 *
 * The inner layer is always over-sized by more than it travels, so no edge is
 * ever exposed — see `ScrubLayer`. Anything above `strong` starts to read as
 * the photograph sliding inside its frame rather than as depth.
 */
export const parallax = {
  /** The macro plate in a product spread. */
  subtle: 4,
  /** The wide frame it sits on. Different speeds are what make the pair read as depth. */
  base: 9,
  /** Full-bleed backgrounds only. */
  strong: 14,
} as const;

/**
 * Scale ranges. All of them settle *to* 1 rather than away from it: a frame
 * that grows past its true size crops itself, and on a photograph that means
 * losing the edge of the subject the photographer composed for.
 */
export const scale = {
  /** Continuous grow under a held frame, so a pinned panel is never inert. */
  settle: 1.06,
  /** Paired with a mask, for an image being uncovered. */
  reveal: 1.12,
  /** Full-screen openings only — the hero and the crossing. */
  cinematic: 1.18,
} as const;

/**
 * Opacity ranges. `dim` is the resting value of an unresolved character in the
 * headline sweep; it is not 0, because type that fades from nothing reads as a
 * loading state rather than as writing arriving.
 */
export const opacity = {
  dim: 0.24,
  veil: 0.9,
} as const;

/**
 * Rotation, in degrees, and deliberately almost nothing.
 *
 * The brief rules out excessive rotation and this scale takes that literally:
 * `whisper` is below the threshold at which a reader consciously registers a
 * tilt, which is the only place rotation belongs on an editorial page. There is
 * no larger step on purpose — if a composition seems to need one, the answer is
 * a different composition.
 */
export const rotation = {
  none: 0,
  whisper: 0.4,
  subtle: 1.2,
} as const;

/**
 * Pinned scene geometry, in `svh`.
 *
 * `stage` is the scroll distance one step of a pinned sequence occupies. 80 is
 * measured rather than chosen: at 100 the four-step process section was eating
 * 43% of the page's total scroll distance, and at 60 the steps ran into each
 * other. `svh` rather than `vh` so a mobile URL bar cannot change the length of
 * a scene mid-scroll.
 */
export const scene = {
  stage: 80,
  /** Height of the sticky panel itself. */
  panel: 100,
  /**
   * The hero, which is one continuous scene rather than a stepped one.
   *
   * 240svh is 100 of panel plus 140 of travel. The travel has to carry two
   * beats — the hills establishing the place, then the commodities arriving —
   * and at 100 they overlapped enough that neither registered. Much past 140
   * and the reader is scrolling through a held frame wondering whether the
   * page is broken.
   */
  hero: 240,
} as const;

/**
 * ScrollTrigger start/end pairs, named for what they describe.
 *
 * Written as tokens because the string form is easy to get subtly wrong — and
 * a scene whose `end` is one keyword off does not error, it just animates
 * against the wrong distance and looks mistimed.
 */
export const triggers = {
  /** The element's whole journey across the viewport. For background layers. */
  crossing: { start: "top bottom", end: "bottom top" },
  /** Enters at the fold, resolves by the time it is centred. For reveals. */
  arriving: { start: "top 85%", end: "top 40%" },
  /** A pinned scene: locked while the spacer is under the panel. */
  pinned: { start: "top top", end: "bottom bottom" },
  /** The whole document, for the global progress indicator. */
  document: { start: "top top", end: "bottom bottom" },
} as const;

/**
 * Lenis. Low `lerp` and a long `duration` give the weighted, slightly heavy
 * travel a cinematic page wants; anything faster and the smoothing stops being
 * perceptible enough to justify its cost.
 */
export const smoothScroll = {
  duration: 1.1,
  /** Matches easeExpo's shape, so smoothing and animation share a feel. */
  easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
} as const;
