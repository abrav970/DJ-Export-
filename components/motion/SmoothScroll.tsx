"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { useMotionPreference } from "@/components/motion/MotionProvider";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { smoothScroll } from "@/lib/motion";

/**
 * Inertial scrolling, and the one place the page's scroll systems are joined.
 *
 * Three things read scroll position on this site — Lenis, ScrollTrigger and
 * Framer's `useScroll` — and they stay in agreement for a reason worth stating,
 * because it is what makes the layered motion architecture viable at all:
 * Lenis animates the *real* document scroll position rather than transforming a
 * wrapper element. `window.scrollY` is therefore always true, Framer needs no
 * adaptation, ScrollTrigger needs no `scrollerProxy`, and `position: sticky` —
 * which every pinned scene in this project depends on — keeps working exactly
 * as the browser intends. A transform-based smooth-scroll library would have
 * broken all three at once.
 *
 * The only wiring required is the frame loop: GSAP's ticker drives Lenis, and
 * Lenis tells ScrollTrigger when the position changed. Running Lenis on its own
 * `requestAnimationFrame` instead would put two loops a frame apart, which
 * shows up as scrubbed layers lagging the page by exactly one frame.
 *
 * `lagSmoothing(0)` disables GSAP's own recovery from long frames. It exists to
 * keep time-based tweens honest after a stall, but a scroll-linked animation
 * has no time to catch up on — its position is the scrollbar — and leaving it
 * on makes a scene jump after any main-thread hitch.
 *
 * Not mounted at all on a coarse pointer or under prefers-reduced-motion:
 *
 *   Touch — iOS Safari's momentum and its URL-bar resize are both driven by the
 *   compositor, and replacing them with a JS-interpolated position is the
 *   single largest source of scroll jank this project could introduce. Native
 *   scrolling on a phone is better than anything a library can do to it.
 *
 *   Reduced motion — interpolating the reader's own input is motion they did
 *   not ask for, and the most direct kind.
 *
 * In both cases this component renders nothing and subscribes to nothing, and
 * the `.lenis` classes never land on <html>, so the CSS in globals.css that
 * hangs off them stays inert too.
 */
export const SmoothScroll = () => {
  const { full } = useMotionPreference();

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The touch rule is absolute — no preference overturns it, because the
    // problem there is not taste but that a JS-interpolated position is worse
    // than the compositor's. The reduced-motion rule is the reader's to
    // overturn, and overturning it is what <MotionProvider> records.
    if (coarse.matches) return;
    if (calm.matches && !full) return;

    const lenis = new Lenis({
      duration: smoothScroll.duration,
      easing: smoothScroll.easing,
      wheelMultiplier: smoothScroll.wheelMultiplier,
      touchMultiplier: smoothScroll.touchMultiplier,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // GSAP's ticker reports seconds; Lenis expects milliseconds.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's default, restored
      lenis.destroy();
    };
    // Rebuilt when the reader opts in, so smoothing starts without a reload.
  }, [full]);

  return null;
};
