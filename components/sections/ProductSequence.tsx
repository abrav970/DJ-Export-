"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { LinesReveal } from "@/components/motion/LinesReveal";
import { ScrollScene, useSceneStep } from "@/components/motion/ScrollScene";
import { TextLink } from "@/components/ui/Button";
import { useMotionPreference } from "@/components/motion/MotionProvider";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { easePremium, gsapEase, rotation, scale, scrub, triggers } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type SequenceItem = {
  slug: string;
  name: string;
  origin: string;
  tagline: string;
  /** Crop in context. Rendered on the server so no photograph enters the bundle. */
  wide: ReactNode;
  /** Macro of the finished commodity. Same. */
  macro: ReactNode;
};

/**
 * The range as one held frame that changes subject.
 *
 * Three editorial spreads stacked down the page are three things a reader
 * scrolls past. Here the spread is pinned and the *commodity* moves through
 * it, which is the difference between a catalogue and a showcase: the reader
 * stands still while the range passes them.
 *
 * The layout is deliberately the one it replaces — wide frame, macro
 * overlapping its corner on a keyline mount, type beside it — because the
 * point of this phase is the choreography, not a new composition.
 *
 * ---
 *
 * THE HAND-OFF IS A WIPE AGAINST A DRIFT, NOT A CROSS-FADE.
 *
 * Two photographs dissolving into each other is the one transition that always
 * reads as a slideshow, because nothing in the frame has direction. So the two
 * halves of each hand-off move against each other:
 *
 *   outgoing   drifts left, grows slightly, falls back in z, and fades
 *   incoming   is wiped open from the right edge, arriving forward in z
 *   macro      follows a beat later on its own vector, with a small rotation
 *
 * The incoming frame is on top of the outgoing one in source order, so the
 * wipe uncovers the new commodity over the old while the old is still visibly
 * leaving. Three things are therefore in motion at once, at three speeds,
 * which is what stops the change reading as a switch.
 *
 * The rotation is `rotation.subtle` — 1.2 degrees, and only on the macro
 * plate. It is below the angle at which a reader consciously registers a tilt,
 * which is the only place rotation belongs on an editorial page; the wide
 * frame does not rotate at all, because a photograph that tilts stops being a
 * window and starts being a card.
 *
 * Under all of it the frame grows very slowly across the whole passage. That
 * one continuous tween is what keeps a pinned panel from reading as a static
 * board between hand-offs.
 *
 * ---
 *
 * WHY THERE ARE TWO SCROLLTRIGGERS ON ONE SPACER.
 *
 * <ScrollScene> owns the pin and the step index. Its trigger is unsmoothed on
 * purpose — it reports which commodity we are on, and that answer drives React
 * state for the type block, the rail and `aria-current`.
 *
 * The imagery runs on a second, scrubbed trigger. The two cannot be merged
 * without losing something real: driving the timeline from the scene's own
 * readout would give `scrub: true` behaviour, which stops dead the instant the
 * reader does and reads as mechanical, while pushing the scrub through React
 * state would re-render the whole stage on every scroll frame.
 *
 * The second trigger fires off the wrapper rather than the scene's spacer,
 * which is the same box: a block wrapper with a single block child and no
 * margins has identical top and bottom, so the geometry matches exactly and
 * <ScrollScene> did not have to grow a prop to expose its internals.
 *
 * ---
 *
 * REDUCED MOTION, AND WHY THE CLASSES LOOK REDUNDANT.
 *
 * Every layer carries an opacity class keyed on the active step, with a CSS
 * transition. That is the baseline and it is complete on its own: the step
 * index runs under `reduce` (a position readout is not an animation — see
 * <ScrollScene>), the global reduced-motion rule collapses transition-duration
 * to nothing, and the commodities switch instantly. No JavaScript branch, and
 * nothing to suppress.
 *
 * When motion is allowed, GSAP writes inline opacity and clip-path on the same
 * elements. Inline styles beat classes, so the timeline simply takes over and
 * the classes go inert — the two systems never fight, and neither has to know
 * about the other.
 *
 * Below lg this component is not rendered at all. Pinning a viewport-height
 * stage on a phone is how a page stops feeling scrollable; the stacked spreads
 * in <ProductStory> are the authored mobile treatment, not a fallback.
 */

/**
 * Scroll distance per commodity, in svh.
 *
 * Above the 80 that stepped scenes default to, because this one spends part of
 * every step on a hand-off rather than holding: at 80 the three windows came
 * to roughly 47svh each and the wipe was still finishing as the next one
 * began, which read as hurry rather than as sequence.
 */
const STAGE = 92;

/** How much of one step's width the hand-off occupies, in timeline units. */
const CROSS = 0.15;

export const ProductSequence = ({ items }: { items: SequenceItem[] }) => {
  const { full } = useMotionPreference();
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const wideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const macroRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(motionQuery(full, "(min-width: 1024px)"), () => {
        const wides = wideRefs.current.filter(Boolean) as HTMLDivElement[];
        const macros = macroRefs.current.filter(Boolean) as HTMLDivElement[];
        if (wides.length < 2) return;

        // Take ownership of opacity from the classes, then hide everything
        // after the first by clip rather than by fade — a frame waiting to be
        // wiped open has to be present, not transparent, or the wipe has
        // nothing to uncover.
        gsap.set(wides, { opacity: 1, clipPath: "inset(0 0 0 0%)" });
        gsap.set(wides.slice(1), { clipPath: "inset(0 0 0 100%)" });
        gsap.set(macros, { opacity: 1, yPercent: 0, rotate: 0 });
        gsap.set(macros.slice(1), { opacity: 0, yPercent: 8, rotate: rotation.subtle });

        const tl = gsap.timeline({
          defaults: { ease: gsapEase.linear, transformPerspective: 1200 },
          scrollTrigger: {
            trigger: wrapRef.current,
            start: triggers.pinned.start,
            end: triggers.pinned.end,
            scrub: scrub.base,
          },
        });

        // The continuous underlay, across the whole passage.
        tl.fromTo(frameRef.current, { scale: 1 }, { scale: scale.settle, duration: 1 }, 0);

        const step = 1 / wides.length;

        for (let i = 1; i < wides.length; i++) {
          const at = i * step - CROSS / 2;

          tl.to(
            wides[i - 1],
            { xPercent: -8, scale: 1.06, z: -120, opacity: 0, duration: CROSS },
            at,
          )
            .fromTo(
              wides[i],
              { clipPath: "inset(0 0 0 100%)", xPercent: 6, z: -60 },
              { clipPath: "inset(0 0 0 0%)", xPercent: 0, z: 0, duration: CROSS },
              at,
            )
            .to(
              macros[i - 1],
              { opacity: 0, yPercent: -8, rotate: -rotation.subtle, duration: CROSS * 0.8 },
              at + CROSS * 0.25,
            )
            .fromTo(
              macros[i],
              { opacity: 0, yPercent: 8, rotate: rotation.subtle },
              { opacity: 1, yPercent: 0, rotate: 0, duration: CROSS * 0.9 },
              at + CROSS * 0.35,
            );
        }
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [items.length, full] },
  );

  return (
    <div ref={wrapRef} className="hidden lg:block">
      <ScrollScene steps={items.length} stage={STAGE}>
        <div className="container-x w-full">
          <div className="grid grid-cols-12 items-center gap-16">
            {/* -------------------------------------------------- imagery -- */}
            <div className="relative col-span-7">
              <div
                ref={frameRef}
                data-parallax-layer
                className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-tile)]"
              >
                {items.map((item, index) => (
                  <SequenceLayer
                    key={item.slug}
                    index={index}
                    ref={(el) => {
                      // Only ever write a real node. These layers re-render on
                      // every step change, and an inline callback ref is a new
                      // function each time — React would otherwise detach with
                      // null and reattach on every commit.
                      if (el) wideRefs.current[index] = el;
                    }}
                    className="duration-[1100ms]"
                  >
                    {item.wide}
                  </SequenceLayer>
                ))}
              </div>

              {/*
                The macro overlaps the corner of the wide frame. Overlap is the
                depth device — no shadow needed — and the keyline is a mount
                rather than a border: two photographs meeting edge to edge have
                no cue that one is laid on the other.
              */}
              <div className="absolute right-[-3rem] bottom-[-3rem] w-[29%] max-w-[11.5rem]">
                <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] ring-[5px] ring-cream-50">
                  {items.map((item, index) => (
                    <SequenceLayer
                      key={item.slug}
                      index={index}
                      ref={(el) => {
                        if (el) macroRefs.current[index] = el;
                      }}
                      className="duration-[1400ms]"
                    >
                      {item.macro}
                    </SequenceLayer>
                  ))}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------- type -- */}
            <div className="relative col-span-5 min-h-[21rem]">
              <SequenceType items={items} />
            </div>
          </div>
        </div>
      </ScrollScene>
    </div>
  );
};

/**
 * One commodity's layer in a stack.
 *
 * The opacity class is the reduced-motion baseline described above; GSAP
 * overrides it inline when motion is allowed.
 */
const SequenceLayer = ({
  index,
  children,
  className,
  ref,
}: {
  index: number;
  children: ReactNode;
  className?: string;
  ref: (el: HTMLDivElement | null) => void;
}) => {
  const { step } = useSceneStep();
  const active = index === step;

  return (
    <div
      ref={ref}
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 transition-opacity ease-[var(--ease-premium)]",
        active ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * The type, remounted per commodity so its lines rise again rather than being
 * swapped as a block. The outgoing copy fades under the incoming reveal, which
 * is the same overlap the photographs use.
 */
const SequenceType = ({ items }: { items: SequenceItem[] }) => {
  const { step } = useSceneStep();
  const current = items[step] ?? items[0];

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={current.slug}
          className="absolute inset-x-0 top-0"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: easePremium } }}
        >
          <LinesReveal
            as="h3"
            lines={[current.name]}
            onLoad
            delay={0.08}
            className="font-display text-feature tracking-[-0.01em] text-ink-950"
          />

          <motion.p
            data-reveal
            className="mt-4 text-[0.6875rem] tracking-[0.28em] text-bronze-700 uppercase"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easePremium, delay: 0.18 }}
          >
            {current.origin}
          </motion.p>

          <motion.p
            data-reveal
            className="mt-5 max-w-sm text-[1.0625rem] leading-[1.8] text-muted-light"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easePremium, delay: 0.26 }}
          >
            {current.tagline}
          </motion.p>

          <motion.div
            data-reveal
            className="mt-8"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easePremium, delay: 0.36 }}
          >
            <TextLink href={`/products/${current.slug}`} className="text-ink-950">
              View product
            </TextLink>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/*
        The rail names the range rather than numbering it. Three commodities are
        a set, not a sequence, so 01/02/03 would assert an order the reader does
        not need — but the names double as the reader's position in the passage.
      */}
      <ol className="absolute inset-x-0 bottom-0 flex gap-6">
        {items.map((item, index) => (
          <li
            key={item.slug}
            aria-current={index === step ? "step" : undefined}
            className={cn(
              "text-[0.6875rem] tracking-[0.2em] uppercase transition-colors duration-700",
              index === step ? "text-bronze-700" : "text-ink-900/35",
            )}
          >
            {item.name}
          </li>
        ))}
      </ol>
    </>
  );
};
