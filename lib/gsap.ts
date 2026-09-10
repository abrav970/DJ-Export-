import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The single place GSAP is registered.
 *
 * Registration is idempotent but not free, and more importantly it is easy to
 * forget: a `ScrollTrigger` used in a component that never registered the
 * plugin fails silently in production builds, where the helpful console warning
 * is stripped. Importing from here makes that impossible — you cannot obtain
 * the plugin without having registered it.
 *
 * `useGSAP` is registered as a plugin too. That is not decoration: it is what
 * lets GSAP attribute animations to the hook's context so they are reverted on
 * unmount, which is the whole reason to use it under React 19 and StrictMode.
 *
 * The window guard matters because this module is imported by client components
 * that Next still renders on the server. GSAP itself tolerates that; the
 * plugins touch `document` while initialising and do not.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);

  /**
   * Re-measure once the web fonts have swapped in.
   *
   * ScrollTrigger caches each trigger's start and end at refresh time, and it
   * refreshes on `DOMContentLoaded`, `load`, `resize` and `visibilitychange` —
   * none of which a font swap fires. Both display faces load with
   * `display: swap`, so the first layout is measured in a fallback and the
   * real one arrives after. Any trigger whose geometry depends on text height
   * is then pinned to numbers that no longer describe the page: measured here,
   * a hero trigger read `end: undefined` before the swap and `end: 849` after.
   *
   * The hero itself survives without this, because its scene length is `svh`
   * and does not depend on text at all. The stepped scenes that come later do
   * depend on it, and a trigger that is silently 40px out is exactly the kind
   * of fault that gets attributed to easing rather than to measurement.
   *
   * Optional-chained because `document.fonts` is absent in some older engines,
   * where the fallback is simply the behaviour we had before.
   */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/**
 * Reduced motion, as a query rather than a boolean.
 *
 * Every scrubbed transform in this project is created inside
 * `gsap.matchMedia()` keyed on this string, so under `reduce` the ScrollTrigger
 * is never created at all — there is nothing running to suppress, and nothing
 * left in a half-animated state. That is a stronger guarantee than animating
 * and then neutralising, and it is why `app/globals.css` only has to catch the
 * Framer half of the site.
 *
 * The deliberate exception is *progress readout*. A scene advancing through its
 * steps is not an animation, it is the reader's position expressed as an index,
 * and suppressing it would strand a reduced-motion visitor on step one of a
 * five-step story. Those triggers run unconditionally; see `ScrollScene`.
 */
export const CALM = "(prefers-reduced-motion: reduce)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * The query a scrubbed scene should actually register under.
 *
 * `gsap.matchMedia()` speaks media queries and nothing else, so a reader's
 * explicit opt-in — which lives in React state, see <MotionProvider> — cannot
 * be expressed as a condition. It is resolved here instead, at the moment the
 * context is built, and the call sites pass `full` in their `useGSAP`
 * dependencies so the whole context is torn down and rebuilt when it changes.
 *
 * `and` is for scenes that also have a width floor. It has to be composed
 * rather than appended because `all` is a media *type* and only legal in the
 * leading position — `"(min-width: 1280px) and all"` is a syntax error that
 * fails silently, which would leave the hero with no timeline at exactly the
 * widths it is built for.
 */
export const motionQuery = (full: boolean, and?: string): string => {
  if (full) return and ?? "all";
  return and ? `${and} and ${MOTION_OK}` : MOTION_OK;
};

export { gsap, ScrollTrigger, useGSAP };
