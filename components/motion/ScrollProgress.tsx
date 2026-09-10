"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { gsapEase, scrub, triggers } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Where the reader is in the whole story, as a hairline.
 *
 * Built here, mounted later: this phase establishes the foundation, and phase
 * 11 decides where the indicator lives. Nothing renders it yet.
 *
 * Deliberately not gated behind `prefers-reduced-motion`, for the same reason
 * `ScrollScene` is not: this is a position readout, not an animation. It is the
 * scrollbar restated in the page's own language, and a reader who asked for
 * less motion has not asked to be told less about where they are. The thing
 * being suppressed elsewhere is *travel the reader did not initiate* — a 1px
 * rule tracking their own scroll is the opposite of that.
 *
 * Which is also why it does not carry `data-progress-line`. That rule pinned
 * `transform: none`, which on an `origin-left` scaled bar means permanently
 * full — an indicator that always reads "you have finished". The attribute had
 * no users left after the section it belonged to was removed, and the rule was
 * dropped in this phase rather than being wired to something it would break.
 *
 * `scaleX` rather than `width`: width is a layout property and this updates on
 * every scroll frame.
 */
export const ScrollProgress = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const tween = gsap.fromTo(
      ref.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: gsapEase.linear,
        scrollTrigger: {
          trigger: document.documentElement,
          start: triggers.document.start,
          end: triggers.document.end,
          scrub: scrub.tight,
        },
      },
    );

    return () => tween.kill();
  });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "block h-px w-full origin-left scale-x-0 bg-bronze-400/70",
        className,
      )}
    />
  );
};
