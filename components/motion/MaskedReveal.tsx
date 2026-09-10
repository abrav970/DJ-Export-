"use client";

import { useRef, type ReactNode } from "react";
import { gsapEase, scale as scaleTokens, triggers } from "@/lib/motion";
import { useMotionPreference } from "@/components/motion/MotionProvider";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type MaskedRevealProps = {
  children: ReactNode;
  className?: string;
  /** Edge the mask opens from. Varied per section so the page is not one trick. */
  from?: "left" | "right" | "bottom" | "top";
  /** Over-scale the photograph settles back from. */
  scale?: number;
  delay?: number;
};

/**
 * A photograph uncovered rather than faded in: the frame wipes open while the
 * image inside settles back from a slight over-scale.
 *
 * Two elements, because a `clip-path` and a `transform` on the same node fight —
 * the outer node carries the wipe, the inner one the scale. The inner settle
 * runs longer than the wipe on purpose: the frame finishes first and the image
 * is still arriving, which is what stops the pair reading as one mechanical
 * gesture.
 *
 * The vocabulary is `RevealImage`'s, deliberately — this is the same gesture at
 * scene scale, and the page should not have two different ideas of what an
 * uncovered photograph looks like.
 *
 * What differs is the failure mode. `RevealImage` server-renders the frame
 * *closed*, so a reader with no JavaScript sees nothing until the `<noscript>`
 * block in the layout resolves the clip. This renders open and closes it from
 * script, inside the reduced-motion guard — so with no script, or under
 * `prefers-reduced-motion`, the closed state is never applied in the first
 * place and the photograph is simply there. There is nothing to rescue and no
 * rule was added to rescue it.
 */
const closedFor = {
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  bottom: "inset(100% 0 0 0)",
  top: "inset(0 0 100% 0)",
} as const;

export const MaskedReveal = ({
  children,
  className,
  from = "left",
  scale = scaleTokens.reveal,
  delay = 0,
}: MaskedRevealProps) => {
  const { full } = useMotionPreference();
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionQuery(full), () => {
        // One timeline, not two tweens: passing the same trigger config to two
        // tweens would build two ScrollTrigger instances for one gesture, and
        // instance count is a budget this project has to keep.
        const tl = gsap.timeline({
          delay,
          scrollTrigger: {
            trigger: frameRef.current,
            start: triggers.arriving.start,
            once: true,
          },
        });

        tl.fromTo(
          frameRef.current,
          { clipPath: closedFor[from] },
          { clipPath: "inset(0 0 0 0)", duration: 1.15, ease: gsapEase.expo },
          0,
        ).fromTo(
          imageRef.current,
          { scale },
          { scale: 1, duration: 1.7, ease: gsapEase.expo },
          0,
        );
      });

      return () => mm.revert();
    },
    { scope: frameRef, dependencies: [from, scale, delay, full] },
  );

  return (
    <div ref={frameRef} className={cn("overflow-hidden", className)}>
      <div ref={imageRef} className="h-full w-full">
        {children}
      </div>
    </div>
  );
};
