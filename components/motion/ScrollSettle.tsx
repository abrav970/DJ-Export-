"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollSettleProps = {
  children: ReactNode;
  className?: string;
  /** Scale the layer starts at, settling to 1 as the frame is scrolled into place. */
  from?: number;
  /** Where the settle completes, as a fraction of the element's travel. */
  until?: number;
};

/**
 * Scroll-scrubbed settle: the photograph is over-scaled when the section is
 * still below the fold and resolves to its true size as the reader brings it
 * up the screen.
 *
 * A one-shot reveal fires and is over; this one is *driven* by the scroll, so
 * the section keeps responding for as long as the reader is moving through it.
 * That is what makes a closing frame feel like the end of the passage above
 * rather than the start of a new band.
 *
 * Transform only — no clip-path, no filter — so it composites on the GPU and
 * cannot cost a layout pass mid-scroll.
 */
export const ScrollSettle = ({
  children,
  className,
  from = 1.16,
  until = 0.72,
}: ScrollSettleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, until], [from, 1], {
    clamp: true,
  });

  return (
    <div ref={ref} className={cn("relative h-full w-full overflow-hidden", className)}>
      <motion.div data-parallax-layer className="h-full w-full" style={{ scale }}>
        {children}
      </motion.div>
    </div>
  );
};
