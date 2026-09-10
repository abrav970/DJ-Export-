"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MouseParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Maximum travel in px at the far edge of the viewport. */
  strength?: number;
};

/**
 * Very slight pointer-following drift for the hero photograph.
 *
 * Deliberately small — a few pixels at the far corner. The point is that the
 * frame is not quite dead while the reader decides where to look, not that the
 * picture follows the cursor.
 *
 * Only bound when the device actually has a fine pointer. On touch there is no
 * cursor to follow and the listener would be pure cost, so the effect subscribes
 * to nothing and the layer stays at rest. The check happens in an effect rather
 * than during render: matchMedia does not exist on the server, so branching on
 * it while rendering would emit different markup on each side.
 */
export const MouseParallax = ({
  children,
  className,
  strength = 14,
}: MouseParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Long, soft spring: the layer trails the pointer instead of tracking it.
  const springX = useSpring(x, { stiffness: 42, damping: 22, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 42, damping: 22, mass: 0.7 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    /*
      The bleed is written to the node rather than held in state.

      React state would be the obvious way to express "the effect bound, so the
      layer needs its margin" — but setting state from an effect is a re-render
      to move one element by a fixed number of pixels that never changes again,
      and the lint rule that rejects it is right to. The markup ships
      `inset-0`, so the server and the resting client agree; this line only
      ever adds an inline override on top.
    */
    const layer = ref.current;
    if (layer) layer.style.inset = `${-strength}px`;

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      x.set(-nx * strength);
      y.set(-ny * strength * 0.6);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (layer) layer.style.inset = "";
    };
  }, [strength, x, y]);

  /*
    A layer that translates inside a fixed frame has to be bigger than the
    frame by at least its own travel, or it drags its edge into view — and
    "into view" here means the layer *behind* it, which in the hero is a
    different photograph. Every other moving layer on the site covers this with
    an over-scale; this one had nothing, and the bug survived because the only
    thing behind it used to be a near-black section ground.

    The bleed is `strength` px on all four sides rather than a percentage
    over-scale, which makes it exact instead of estimated: horizontal travel is
    `strength` and vertical is `strength * 0.6`, so one inset covers both with
    room to spare, at any element size, with no crop worth measuring.

    It is applied only while the effect is bound — see the effect above. Under
    reduced motion or on a touch device nothing moves, so nothing needs
    covering, and the framing stays pixel-identical to the markup.
  */
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <motion.div
        ref={ref}
        data-parallax-layer
        className="absolute inset-0"
        style={{ x: springX, y: springY }}
      >
        {children}
      </motion.div>
    </div>
  );
};
