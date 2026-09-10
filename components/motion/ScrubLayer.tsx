"use client";

import { useRef, type ReactNode } from "react";
import { useMotionPreference } from "@/components/motion/MotionProvider";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { gsapEase, parallax, scrub as scrubTokens, triggers } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ScrubLayerProps = {
  children: ReactNode;
  /** Applied to the frame. The frame owns the aspect ratio and the clip. */
  className?: string;
  /** Total travel as a percentage of element height, ± half in each direction. */
  distance?: number;
  /** Seconds of catch-up after the scroll stops. */
  scrub?: number;
};

/**
 * The GSAP counterpart to `Parallax`: a photograph that travels slower than the
 * page, inside a frame that clips it.
 *
 * The over-scale is not decoration. A layer that translates inside a fixed
 * frame will expose an edge at one end of its travel unless it is larger than
 * the frame by more than it moves, so the scale is derived from the distance
 * rather than chosen — `distance/100` covers the travel and the remaining 0.06
 * is margin for sub-pixel rounding at the extremes.
 *
 * ---
 *
 * This renders *finished*, and motion is added afterwards. That is the opposite
 * of the Framer primitives, and it is the more important half of what this
 * phase changed.
 *
 * `Reveal`, `RevealImage` and the rest are server-rendered in their hidden
 * state — opacity 0, a clipped frame — and brought back by JavaScript, which is
 * why `app/globals.css` and the `<noscript>` block in the layout have to carry
 * a rule for each of them: without those rules, no script means a blank page
 * rather than an unanimated one.
 *
 * Nothing here has that failure mode. The server renders the layer flush and at
 * rest; GSAP only ever adds movement to something already visible. With no
 * script, or under `prefers-reduced-motion` where the `matchMedia` block never
 * runs, the reader gets the photograph exactly as composed. No CSS rule is
 * needed to rescue it, and none was added.
 *
 * `data-parallax-layer` is kept anyway, as a belt-and-braces catch for the
 * narrow window where a reader flips the OS setting on a page GSAP has already
 * animated.
 */
export const ScrubLayer = ({
  children,
  className,
  distance = parallax.base,
  scrub = scrubTokens.base,
}: ScrubLayerProps) => {
  const { full } = useMotionPreference();
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionQuery(full), () => {
        const cover = 1 + distance / 100 + 0.06;

        gsap.fromTo(
          layerRef.current,
          { yPercent: -distance, scale: cover },
          {
            yPercent: distance,
            scale: cover,
            // Linear, always. An eased scrub means the picture moves at a
            // different rate than the reader's hand, which reads as lag.
            ease: gsapEase.linear,
            scrollTrigger: {
              trigger: frameRef.current,
              start: triggers.crossing.start,
              end: triggers.crossing.end,
              scrub,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: frameRef, dependencies: [distance, scrub, full] },
  );

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden", className)}>
      <div ref={layerRef} data-parallax-layer className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};
