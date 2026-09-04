"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Media } from "@/components/media/Media";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { LinesReveal } from "@/components/motion/LinesReveal";

/**
 * The crossing — the last beat of the journey above, not a separate band.
 *
 * The section opens already at deep forest, exactly where the journey left off,
 * and the photograph is uncovered by the scroll itself rather than by a reveal
 * that fires once and is finished. Two values are bound straight to the
 * reader's progress: the frame settles back from an over-scale, and the veil
 * over it clears. Scroll forward and the vessel arrives; scroll back and it
 * withdraws. That reciprocity is what makes packing → loaded → documented →
 * shipped read as one shipment being followed rather than as four sections that
 * happen to be adjacent.
 *
 * Only transform and opacity are animated, so the whole passage composites on
 * the GPU and the scrub cannot cost a layout pass.
 *
 * One line of type, no control: the reader is one scroll from the enquiry and
 * does not need to be asked twice.
 */
export const Crossing = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Both resolve by the time the frame is a little past centre, so the second
  // half of the section is calm and the headline is read against a settled
  // picture rather than a moving one.
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.18, 1], { clamp: true });
  const veil = useTransform(scrollYProgress, [0.04, 0.5], [0.9, 0], { clamp: true });

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink-950 py-24 lg:min-h-[86svh]"
    >
      <motion.div data-parallax-layer style={{ scale }} className="absolute inset-0">
        <Media slot="port" sizes="100vw" tone="dark" />
      </motion.div>

      {/* Scroll-driven veil: the forest above thins out as the vessel arrives. */}
      <motion.div
        aria-hidden="true"
        data-scroll-veil
        style={{ opacity: veil }}
        className="absolute inset-0 bg-ink-950"
      />

      {/*
        Emerges from the forest above and settles back into it below — and the
        bottom stop is opaque, not 0.86. At 0.86 the photograph was still
        faintly present at the last pixel and then stopped dead against the
        solid band underneath, which put a hard rule across the page at exactly
        the seam this section exists to remove.

        The 72% stop is where the headline sits. The sun in this frame is low
        and left, directly behind the type, so the scrim has to be carrying
        weight by then. Measured against the composited pixels the type actually
        covers, cream on its worst pixel goes from 3.03:1 under the old ramp —
        a fail even at display size — to 5.36:1 under this one.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,#10231b_0%,rgba(16,35,27,0.5)_24%,rgba(16,35,27,0.3)_46%,rgba(16,35,27,0.72)_72%,#10231b_100%)]"
      />

      <div className="container-x relative">
        <LabelReveal tone="dark">Global markets</LabelReveal>
        <LinesReveal
          lines={["From India's growing regions", "to global markets."]}
          accentLines={[1]}
          delay={0.12}
          className="mt-6 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.12] tracking-[-0.01em] text-cream-50"
        />
      </div>
    </section>
  );
};
