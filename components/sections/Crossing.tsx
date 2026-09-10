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

      {/*
        A second wash, left-weighted, and it is a contrast fix rather than a
        mood one.

        The vertical ramp above was tuned against the *headline*, which sits at
        57% of the section where this photograph is dark — it measures 10.02:1
        there. The eyebrow sits at 35%, where the ramp has thinned to 0.40 alpha
        and the frame underneath is the sunset itself: sampled off the decoded
        image, the pixels behind those eight characters average rgb(204,153,80).
        Bronze on that composite is 3.16:1, against a 4.5 requirement. It has
        been failing since the section was built; nobody checked the label
        because the headline passed.

        Darkening the vertical ramp enough to fix it would need roughly 0.60
        alpha across the whole mid-band, which is where the vessel and the sky
        are, and would flatten the one photograph on the page that has any light
        in it. So the extra density is placed where the type is instead: strong
        at the left edge, gone by 72% of the width, and starting below the top
        quarter so the sunset in the upper left is untouched.

        The two washes multiply rather than add — 0.40 and 0.48 compose to 0.69
        — which is what carries the eyebrow over the line without the headline's
        own reading changing at all.

        The top edge is a mask, not a `top` offset. The first version began at
        22% with no ramp, and a gradient that starts at 0.66 alpha against clear
        sky draws a hard rule straight across the frame — clearly visible as a
        step in the cloud. Feathering it from nothing at 6% to full at 30% puts
        the whole ramp above the eyebrow, so the density where the type sits is
        unchanged and the edge has nowhere to show.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,35,27,0.66)_0%,rgba(16,35,27,0.4)_42%,transparent_72%)] [mask-image:linear-gradient(to_bottom,transparent_6%,black_30%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_6%,black_30%,black_100%)]"
      />

      <div className="container-x relative">
        {/*
          This closes the story again.

          The copy was briefly changed to "Departure" while a separate
          international-markets section sat underneath — two consecutive bands
          announcing the same conclusion made the second read as a repeat. That
          section has been removed, so this is once more the last thing the page
          says before the enquiry, and it says where the goods go.
        */}
        <LabelReveal tone="dark">Global markets</LabelReveal>
        <LinesReveal
          lines={["From Wayanad's growing region", "to global markets."]}
          accentLines={[1]}
          delay={0.12}
          className="mt-6 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.12] tracking-[-0.01em] text-cream-50"
        />
      </div>
    </section>
  );
};
