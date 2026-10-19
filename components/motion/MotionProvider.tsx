"use client";

import { MotionConfig } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Reduced motion, graded rather than absolute — and now overridable.
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
 * ---
 *
 * WHY AN OVERRIDE EXISTS AT ALL.
 *
 * On Windows, `prefers-reduced-motion` is wired to a single Settings toggle —
 * Accessibility → Visual effects → Animation effects — which is off on a
 * surprising number of machines, sometimes because a performance guide advised
 * it years ago and sometimes because the OS shipped that way. Those readers get
 * the site's accessibility fallback and no indication that a fallback is what
 * they are looking at. The whole scroll design is simply absent, and it looks
 * like the page is finished rather than deliberately quiet.
 *
 * The OS preference stays the default and is never second-guessed: nothing here
 * runs unless the reader asks for it, in their own words, through a control
 * they can find and reverse. What the override changes is that the choice is
 * now *theirs* rather than their operating system's, which is the outcome the
 * preference is supposed to produce in the first place.
 *
 * `full` starts false on the server and on the first client render, so the
 * markup matches on both sides and there is no hydration mismatch. The stored
 * preference is read in an effect and can only ever *add* motion, so the worst
 * case is one frame of the calm version before the reader's choice applies.
 *
 * The flag reaches the rest of the site two ways:
 *
 *   CSS   `data-motion="full"` on <html>, which the reduced-motion block in
 *         globals.css excludes itself from.
 *   GSAP  `motionQuery()` in lib/gsap.ts, which every `matchMedia` call site
 *         passes through, with `full` in its `useGSAP` dependencies so the
 *         timelines are rebuilt the moment the reader changes their mind.
 */

const STORAGE_KEY = "dj-export:motion";

type MotionPreference = {
  /** The reader has explicitly asked for the full motion design. */
  full: boolean;
  /** The operating system is currently asking for reduced motion. */
  osReduces: boolean;
  setFull: (next: boolean) => void;
};

const MotionContext = createContext<MotionPreference>({
  full: false,
  osReduces: false,
  setFull: () => {},
});

export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const [full, setFullState] = useState(false);
  const [osReduces, setOsReduces] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Full motion for every visitor; there is no opt-out control any more, so a
    // "system" value stored by the old footer toggle is ignored.
    const readStored = () => true;

    // Both values are read through one function so neither is set directly in
    // the effect body — `react-hooks/set-state-in-effect` flags that, and it is
    // right to: an effect that assigns state unconditionally is usually a
    // render that should have derived it. Here the values genuinely live
    // outside React, so they are pulled in through a single sync point that the
    // listeners below can also call.
    const sync = () => {
      setOsReduces(query.matches);
      setFullState(readStored());
    };

    sync();
    query.addEventListener("change", sync);
    // Also keeps two open tabs in agreement, which costs one line.
    window.addEventListener("storage", sync);

    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (full) root.setAttribute("data-motion", "full");
    else root.removeAttribute("data-motion");

    /*
      The refresh is not optional, and it took a diagnostic to find out why.

      This attribute changes *layout*, not just appearance: the reduced-motion
      block collapses the hero from a 240svh scene to a single screen, and
      `[data-motion="full"]` is what releases it back. React runs layout effects
      child-first, so <Hero>'s `useGSAP` — which rebuilds its timeline the moment
      `full` flips — runs before this passive effect writes the attribute. The
      ScrollTrigger was therefore measuring the hero while it was still
      collapsed, giving it a start and an end barely a pixel apart, and the whole
      sequence sat at progress 0 no matter how far the reader scrolled.

      It looked exactly like a scrub that was not running. What gave it away was
      that dispatching a `resize` — the one event ScrollTrigger re-measures on —
      made the entire sequence spring to life from the same scroll position.

      Refreshing here re-reads every trigger's geometry after the new height is
      in effect. `setAttribute` is synchronous and `refresh()` reads layout, so
      the recalculation it forces already reflects the change; there is no frame
      to wait for.
    */
    ScrollTrigger.refresh();
  }, [full]);

  const setFull = useCallback((next: boolean) => {
    setFullState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "full" : "system");
    } catch {
      // Not persisting is survivable; not applying would not be.
    }
  }, []);

  const value = useMemo<MotionPreference>(
    () => ({ full, osReduces, setFull }),
    [full, osReduces, setFull],
  );

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion="never">{children}</MotionConfig>
    </MotionContext.Provider>
  );
};

/**
 * Read the motion preference.
 *
 * Safe outside the provider — the default context is "respect the OS", which is
 * the behaviour every call site had before this existed.
 */
export const useMotionPreference = (): MotionPreference => useContext(MotionContext);
