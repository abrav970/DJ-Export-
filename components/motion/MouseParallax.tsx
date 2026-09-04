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

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      x.set(-nx * strength);
      y.set(-ny * strength * 0.6);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [strength, x, y]);

  return (
    <motion.div
      ref={ref}
      data-parallax-layer
      className={cn("h-full w-full", className)}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};
