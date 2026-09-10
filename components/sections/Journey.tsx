"use client";

import { useRef, useState } from "react";
import { Media } from "@/components/media/Media";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { sourcingStages } from "@/data/company";
import { useMotionPreference } from "@/components/motion/MotionProvider";
import { gsap, motionQuery, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { gsapEase, parallax, scrub, triggers } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Source → Select → Assess → Prepare → Export, as one passage rather than five
 * sections.
 *
 * Sourcing and shipping used to be separate bands with a hard seam between
 * them, which is exactly why the page read as a stack of blocks. They are one
 * band now, and the band's own background travels sand → olive → moss → forest
 * → deep forest as the reader descends, so the light changes continuously and
 * there is no boundary to notice.
 *
 * The photograph is sticky and the text steps past it. That is what makes it a
 * journey rather than five pictures: the reader stays in one frame while the
 * subject inside it advances, and the frame drifts slightly against the scroll
 * so it is never quite inert. The last two stages — packing, then loaded and
 * documented — run straight into the closing crossing below without a band
 * change, so the shipment is followed rather than announced twice.
 *
 * The copy is in `data/company.ts`, together with the note on what this section
 * is not permitted to claim. Read that before editing a word of it.
 *
 * ---
 *
 * THE HAND-OFF IS A WIPE, AND IT IS SLOWER THAN THE PRODUCT SEQUENCE.
 *
 * The stages used to cross-fade. A dissolve is the one transition that always
 * reads as a slideshow, because nothing in the frame has direction, so the
 * hand-off is now a clip wipe with a depth push underneath it — the same
 * vocabulary <ProductSequence> uses, deliberately, because the page should not
 * have two ideas of what a change of subject looks like.
 *
 * Two things differ, and both are the point of this section:
 *
 *   The wipe opens from the bottom edge, where the sequence wipes from the
 *   right. Two pinned passages a screen apart running the identical gesture is
 *   how a site starts to read as one trick.
 *
 *   It is slower. The sequence hands off in 1100ms with a 1400ms macro behind
 *   it; this runs 1700ms with a 2100ms settle, and the frame drifts at
 *   `scrub.loose` against the sequence's `scrub.base`. The brief for this
 *   section is confidence rather than spectacle, and confidence is paced.
 *
 * WHY `index <= active` AND NOT `index === active`.
 *
 * Only the layers above the active one are clipped shut; everything at or
 * below it stays open underneath. That is what makes the wipe gapless in both
 * directions. Closing the outgoing layer from the same edge the incoming one
 * opens from looks symmetrical written down and tears a hole through to the
 * band on the way: at the halfway point the two visible bands are both the
 * lower half of the frame, and the top half has nothing in it at all.
 *
 * Scrolling forward, the incoming layer is higher in the stack and wipes open
 * over a stage that is still fully there. Scrolling back, the outgoing layer is
 * the higher one and closes to uncover the stage beneath it. One rule, both
 * directions, no gap.
 *
 * ---
 *
 * TWO SCROLLTRIGGERS, FOR THE REASON <ProductSequence> HAS TWO.
 *
 * The step readout drives React state — the copy, the rail, `aria-current` —
 * and runs unconditionally, because a reader's position in a five-step story is
 * not an animation. Suppressing it under `reduce` would strand someone on stage
 * one with no way to reach the rest. The frame drift is a transform and lives
 * inside `matchMedia(MOTION_OK)`, so under `reduce` it is never built.
 *
 * The hand-off itself needs no branch at all: it is CSS transitions keyed on
 * the active step, and the global reduced-motion rule collapses
 * transition-duration, so the stages switch instantly instead of wiping.
 *
 * Below lg the panel is not sticky: pinning a viewport-height image on a phone
 * traps the reader rather than guiding them, so the stages become an ordinary
 * ordered list with a masked reveal each.
 */

const STAGES = sourcingStages;

/**
 * Scroll distance per stage — and deliberately not `scene.stage`.
 *
 * That token is the length of a *scrubbed* step, tuned so a scene has room to
 * animate. This is reading distance for a paragraph, and it was measured
 * against the band's tonal gradient below: at 74svh the five stages land at
 * 15%, 32%, 51%, 68% and 86% of the section, which is what puts the whole
 * sand → forest move in the gap between stage two and stage three where no
 * text is sitting. Change it and the gradient stops need re-measuring with it.
 */
const READ_STAGE = "min-h-[74svh]";

export const Journey = () => {
  const { full } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      // ---------------------------------------------------------- readout --
      const emit = (self: ScrollTrigger) => {
        // Floor into buckets, clamped: at progress exactly 1 the raw index is
        // `length`, which is one past the last authored stage.
        const next = Math.min(
          STAGES.length - 1,
          Math.max(0, Math.floor(self.progress * STAGES.length)),
        );
        setActive((current) => (current === next ? current : next));
      };

      const readout = ScrollTrigger.create({
        trigger: ref.current,
        start: triggers.pinned.start,
        end: triggers.pinned.end,
        onUpdate: emit,
        // Also on refresh, so the passage entered mid-way — a reload at depth,
        // a back-navigation to a restored position — opens on the right stage
        // rather than on stage one until the reader moves.
        onRefresh: emit,
      });

      // ------------------------------------------------------------ drift --
      const mm = gsap.matchMedia();

      mm.add(motionQuery(full), () => {
        // Take ownership of opacity from the classes. The layers carry an
        // opacity baseline for reduced motion (see the markup); with motion
        // allowed the wipe is the transition and a fade underneath it would
        // only soften the edge the wipe exists to draw. Inline beats class, and
        // `mm.revert()` puts it back.
        gsap.set(gsap.utils.toArray("[data-stage-layer]", ref.current), { opacity: 1 });

        // The held frame travels a few percent across the whole passage.
        // Nothing moves behind it, so this is not parallax in the usual sense —
        // it is what stops a sticky element that never translates from reading
        // as a paused video. `subtle` at `loose`: the smallest travel in the
        // scale, at the heaviest catch-up, which is the slowest drift the
        // tokens describe.
        gsap.fromTo(
          frameRef.current,
          { yPercent: -parallax.subtle },
          {
            yPercent: parallax.subtle,
            // Linear, always. An eased scrub moves the picture at a different
            // rate than the reader's hand, which reads as lag.
            ease: gsapEase.linear,
            scrollTrigger: {
              // The whole passage, not the frame: the frame is sticky, so its
              // own box would give ScrollTrigger the geometry of where it
              // starts rather than the distance it is held for.
              trigger: ref.current,
              start: triggers.pinned.start,
              end: triggers.pinned.end,
              scrub: scrub.loose,
            },
          },
        );
      });

      return () => {
        readout.kill();
        mm.revert();
      };
    },
    { scope: ref, dependencies: [full] },
  );

  return (
    <section
      id="sourcing"
      /*
        One continuous change of light — but the mid-tones are spent in the gap
        between stage two and stage three, not under a stage. Moss and olive are
        beautiful and unusable as a text ground: cream clears only 3.6:1 on moss
        and deep forest only 4.0:1, so a stage sitting there fails either way.

        RE-MEASURED for this phase, and it had to be. The positioning line under
        the heading is three lines of copy, which pushed every stage roughly six
        points down the section — enough to slide stage two's body text onto the
        ramp, which is precisely the failure this comment exists to prevent. The
        stops are not decoration and they are not portable: they encode where
        the text is.

        Measured against the real text boxes, not the stage centres. Copy now
        occupies 17.5–24.9%, 34.4–41.8%, 50.5–59.4%, 68.6–75.0% and 85.5–91.9%,
        so the only ground with no type on it at all is the 263px between 41.8%
        and 50.5%. The whole tonal move is spent there: flat sand to 42.5%, flat
        forest from 49.5%. Nothing is stranded on the mid-tones.
      */
      className="relative bg-[linear-gradient(to_bottom,#e6ddcb_0%,#e6ddcb_42.5%,#a8ad7c_44.8%,#4a5e46_47.2%,#10231b_49.5%,#10231b_100%)]"
    >
      <div className="container-x pt-[var(--spacing-section)]">
        <div className="max-w-2xl">
          <LabelReveal>Sourcing and quality</LabelReveal>
          <HeadingReveal
            text="Sourced in Wayanad, prepared for export"
            accentWords={["prepared"]}
            delay={0.08}
            className="mt-6 font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.1] tracking-[-0.01em] text-ink-950"
          />
          {/*
            The positioning line, and the reason it is the first thing said. A
            sourcing story told in photographs of hillsides and picking hands
            invites the reader to assume the company owns them. Naming the role
            once, plainly, at the top is what stops five stages of estate
            imagery from adding up to a claim nobody made.
          */}
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.8] text-muted-light">
              DJ Export is a trading and export house. We buy at origin, select
              against your specification, and prepare each lot for the voyage.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ------------------------------------------------ desktop: sticky ---- */}
      <div ref={ref} className="relative mt-16 hidden lg:block">
        <div className="container-x">
          <div className="grid grid-cols-12 gap-16">
            {/* Text steps past the frame */}
            <div className="col-span-5">
              {STAGES.map((stage, index) => {
                const light = index <= 1;

                return (
                  <div
                    key={stage.id}
                    className={cn("flex flex-col justify-center", READ_STAGE)}
                    aria-current={index === active ? "step" : undefined}
                  >
                    {/*
                      Numbered, where it used to be an unlabelled word. Five
                      stages with no count leaves the reader working out how far
                      through they are from the height of the scrollbar; "03 —
                      Assess" answers it in the type, which is the quietest place
                      a progress indicator can live.
                    */}
                    <LabelReveal rule={false} tone={light ? "light" : "dark"}>
                      {`${stage.step} — ${stage.label}`}
                    </LabelReveal>

                    <HeadingReveal
                      as="h3"
                      text={stage.title}
                      accentWords={[]}
                      delay={0.06}
                      className={cn(
                        "mt-5 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.1] tracking-[-0.01em]",
                        light ? "text-ink-950" : "text-cream-50",
                      )}
                    />

                    <Reveal delay={0.16}>
                      <p
                        className={cn(
                          "mt-5 max-w-sm text-[1.0625rem] leading-[1.8]",
                          light ? "text-muted-light" : "text-muted-dark",
                        )}
                      >
                        {stage.body}
                      </p>
                    </Reveal>
                  </div>
                );
              })}
            </div>

            {/* One frame, held; the subject inside it advances */}
            <div className="col-span-7">
              <div className="sticky top-0 flex h-svh items-center">
                <div className="relative aspect-[4/5] max-h-[76svh] w-full overflow-hidden rounded-[var(--radius-tile)]">
                  {/*
                    Inset by more than the drift distance so no edge is ever
                    exposed. `parallax.subtle` is 4% of this element's height and
                    the bleed is 6% at each end — the extra 2 is margin for
                    sub-pixel rounding at the extremes, the same reasoning
                    <ScrubLayer> derives its over-scale from.
                  */}
                  <div ref={frameRef} data-parallax-layer className="absolute inset-[-6%]">
                    {STAGES.map((stage, index) => (
                      <div
                        key={stage.id}
                        data-stage-layer
                        aria-hidden={index !== active}
                        /*
                          Two properties, for two audiences.

                          The clip is the authored gesture. The opacity beside it
                          is the reduced-motion baseline, and it is keyed on the
                          same `index <= active` rule so the two never disagree:
                          under `reduce` the clip lands instantly and the layer
                          fades instead, which turns the wipe into the quieter
                          version of itself rather than a hard cut.

                          That baseline was lost when this section moved from a
                          cross-fade to a wipe, and its absence was invisible
                          from a machine where motion is allowed. It is the same
                          arrangement <ProductSequence> uses, and for the same
                          reason.

                          When motion *is* allowed GSAP writes inline opacity in
                          the block above, and an inline style beats a class — so
                          the timeline takes over and this goes inert. The two
                          systems never fight.
                        */
                        className={cn(
                          "absolute inset-0 transition-[clip-path,opacity] duration-[1700ms] ease-[var(--ease-premium)]",
                          index <= active
                            ? "[clip-path:inset(0_0_0_0)] opacity-100"
                            : "[clip-path:inset(100%_0_0_0)] opacity-0",
                        )}
                      >
                        {/*
                          Depth on its own node. A clip-path and a transform on
                          the same element fight: the clip is resolved in the
                          element's own coordinate space, so scaling the element
                          scales the mask with it and the wipe stops being a
                          wipe. The settle also runs longer than the wipe, so the
                          frame finishes opening while the photograph inside it
                          is still arriving.
                        */}
                        <div
                          className={cn(
                            "h-full w-full transition-transform duration-[2100ms] ease-[var(--ease-premium)]",
                            index === active ? "scale-100" : "scale-[1.06]",
                          )}
                        >
                          <Media slot={stage.slot} sizes="(min-width: 1024px) 58vw, 1px" tone="dark" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress, as a hairline rather than a widget */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 flex gap-1.5 p-5"
                  >
                    {STAGES.map((stage, index) => (
                      <span key={stage.id} className="h-px flex-1 overflow-hidden bg-cream-50/25">
                        <span
                          className={cn(
                            "block h-full w-full origin-left bg-bronze-300 transition-transform duration-700 ease-[var(--ease-premium)]",
                            index <= active ? "scale-x-100" : "scale-x-0",
                          )}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- mobile: stacked --- */}
      <ol className="container-x mt-12 space-y-14 lg:hidden">
        {STAGES.map((stage, index) => {
          const light = index <= 1;

          return (
            <li key={stage.id}>
              <RevealImage
                className="rounded-[var(--radius-tile)]"
                from={index % 2 === 0 ? "left" : "right"}
                scale={1.12}
              >
                <div className="aspect-[4/3] w-full">
                  <Media slot={stage.slot} sizes="(max-width: 1023px) 100vw, 1px" tone="dark" />
                </div>
              </RevealImage>

              <LabelReveal
                rule={false}
                tone={light ? "light" : "dark"}
                className="mt-6"
                delay={0.1}
              >
                {`${stage.step} — ${stage.label}`}
              </LabelReveal>

              <HeadingReveal
                as="h3"
                text={stage.title}
                accentWords={[]}
                delay={0.16}
                className={cn(
                  "mt-3 font-display text-[1.85rem] leading-tight",
                  light ? "text-ink-950" : "text-cream-50",
                )}
              />

              <Reveal delay={0.24}>
                <p
                  className={cn(
                    "mt-3 text-[0.9375rem] leading-[1.75]",
                    light ? "text-muted-light" : "text-muted-dark",
                  )}
                >
                  {stage.body}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <div className="h-[var(--spacing-section)]" />
    </section>
  );
};
