"use client";

import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { LinesReveal } from "@/components/motion/LinesReveal";
import { MouseParallax } from "@/components/motion/MouseParallax";
import { ButtonLink } from "@/components/ui/Button";
import { useMotionPreference } from "@/components/motion/MotionProvider";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { easeExpo, easePremium, gsapEase, scene, scrub, triggers } from "@/lib/motion";

type HeroProps = {
  /** The commodities. Rendered on the server so no photograph enters the client bundle. */
  media: ReactNode;
  /** The far plane. Same deal. */
  hills: ReactNode;
};

/**
 * Wayanad → pepper, coffee and cardamom → international markets, as one
 * continuous move rather than three statements.
 *
 * The section is a 240svh spacer with a 100svh panel stuck to the top of it,
 * so scrolling the first two screens travels *through* the hero instead of
 * past it. What the reader crosses is a distance, not a slideshow:
 *
 *   far    the hill estates, drifting up and growing, then clearing
 *   mid    cloud, moving faster than the ridge behind it
 *   near   the three commodities, arriving out of depth and settling
 *   type   leaving upward, ahead of all of it
 *
 * The layers are separated by translateZ under their own perspective rather
 * than by scale alone. Scale makes a picture bigger; z makes it nearer, and
 * the difference is legible even at this restraint because the near layer
 * gains parallax against the far one as it comes forward.
 *
 * ---
 *
 * WHAT THE SERVER RENDERS IS THE OLD HERO, EXACTLY.
 *
 * The commodity photograph is the base layer at full opacity, with the type
 * over it — which is to say a reader with no JavaScript, a reader who asked
 * for reduced motion, and every reader below 1280px gets the composition this
 * section had before, unchanged, and the measured decisions behind it survive
 * untouched. The hills are an *addition*: `opacity: 0` in the markup, raised
 * to 1 by GSAP inside its `matchMedia` guard, and cleared again by the time
 * the commodities have arrived.
 *
 * That ordering is load-bearing in three places:
 *
 *   1. It preserves the seam. The pinned sequence ends on the commodity frame
 *      at full bleed, which is where the hero used to end — so the measured
 *      ramp at the top of <ProductStory>, whose first stop is the average of
 *      that photograph's last visible row, still meets the right colour.
 *   2. It keeps the strongest commercial image as the fallback. A buyer who
 *      never scrolls, or never gets the enhancement, still sees the product.
 *   3. It means nothing needs rescuing. The hills carry `data-scroll-veil`,
 *      whose existing reduced-motion rule pins opacity to 0 — the resting
 *      value — so a reader who flips the OS setting mid-page gets the base
 *      composition back rather than a plate stuck over it.
 *
 * The pin is `position: sticky` over a spacer, not ScrollTrigger's `pin`, for
 * the reasons in <ScrollScene>. ScrollTrigger only reads position here.
 *
 * ---
 *
 * Every layer carries an explicit z-index, and they are not optional:
 *
 *   z-0   commodities        the base, and the whole section below xl
 *   z-1   commodity scrim    tuned to that photograph, revealed when the hills go
 *   z-2   hills              covers both until it clears
 *   z-3   cloud
 *   z-4   depth vignette
 *   z-10  type
 *
 * Source order alone would paint the commodities *over* the hills, because
 * they come later in the markup — and they come later because below xl they
 * are a flex item whose `order` has to keep them under the type. Leaning on
 * document order here silently loses the far plane at every width above 1280.
 *
 * ---
 *
 * The breakpoint is xl (1280), not the lg (1024) used everywhere else, and it
 * is the pre-existing crop measurement that sets it: `object-cover` on a
 * section taller than this picture's 16:9 has to trim width, and at 1024 that
 * measured 44px off the pepper bowl and 98px off the coffee. Below xl the
 * photograph is a band under the type, there is no overlay to build depth in,
 * and so there is no scene — the spacer collapses to one screen and the
 * section behaves exactly as it did.
 */
const LINES = [
  "Pepper, coffee and cardamom from Wayanad,",
  "supplied to international markets.",
];

export const Hero = ({ media, hills }: HeroProps) => {
  const { full } = useMotionPreference();
  const sceneRef = useRef<HTMLElement>(null);
  const hillsRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Both conditions, in one query. Below xl there is no overlay to build
      // depth in; under `reduce` there should be no travel at all. Neither
      // case creates a ScrollTrigger, so neither has anything to suppress.
      // The motion half is composed from the shared constant rather than
      // spelled out, so it cannot drift from the rest of the site.
      mm.add(motionQuery(full, "(min-width: 1280px)"), () => {
        // Raised before first paint — useGSAP runs in a layout effect — so the
        // hills are simply the opening frame rather than something that
        // appears a beat after the page settles.
        gsap.set(hillsRef.current, { opacity: 1 });

        const tl = gsap.timeline({
          // transformPerspective per element rather than `perspective` on the
          // panel: the panel is `overflow-hidden`, and a clipping ancestor
          // owning the 3D context flattens children unpredictably across
          // engines. Each layer carrying its own is duller in theory and
          // identical at this depth, and it cannot be broken by the clip.
          defaults: { ease: gsapEase.linear, duration: 1, transformPerspective: 1200 },
          scrollTrigger: {
            trigger: sceneRef.current,
            start: triggers.pinned.start,
            end: triggers.pinned.end,
            scrub: scrub.base,
          },
        });

        // A unit timeline: every position below is a fraction of the travel,
        // which is the only way a six-layer sequence stays readable.
        tl
          // far — the ridge rises and grows for the whole passage, so it is
          // still moving when it goes, rather than stopping and then fading.
          // The 1.02 floor is the same coverage argument: the layer travels up
          // 6%, and an untransformed plate has no overflow to give.
          .fromTo(
            hillsRef.current,
            { yPercent: 0, scale: 1.02, z: 0 },
            { yPercent: -6, scale: 1.18, z: 60 },
            0,
          )
          .to(hillsRef.current, { opacity: 0, duration: 0.3 }, 0.36)

          // mid — cloud, faster than the ridge it sits on. This is the whole
          // trick: two speeds over one photograph read as two distances.
          .fromTo(
            cloudRef.current,
            { yPercent: 0, opacity: 0.62 },
            { yPercent: -22, opacity: 0, duration: 0.66 },
            0,
          )

          // near — the commodities come forward out of depth. They start
          // behind the picture plane, so the move is toward the reader.
          //
          // 1.2 is not a taste value, it is the coverage floor. Under a 1200
          // perspective, z:-180 shrinks the layer to 1200/1380 = 0.870, so a
          // scale below 1/0.870 = 1.15 leaves the plate smaller than the panel
          // and the layer behind it shows along the top edge. 1.2 clears that
          // with margin, and because both properties interpolate linearly the
          // product of the two stays above 1 for the whole tween:
          //
          //   t=0    1.20 x 0.870 = 1.043
          //   t=0.5  1.10 x 0.930 = 1.023
          //   t=1    1.00 x 1.000 = 1.000
          .fromTo(
            productRef.current,
            { scale: 1.2, z: -180 },
            { scale: 1, z: 0, duration: 0.66 },
            0.2,
          )

          // type — leaves first and fastest, so the reader is looking at the
          // photograph by the time the commodities land rather than reading
          // over them.
          .to(typeRef.current, { yPercent: -46, opacity: 0, duration: 0.36 }, 0.12)

          // Depth closes in as the frame settles: the corners darken, which is
          // what stops the last screen reading as a flat product shot.
          .fromTo(depthRef.current, { opacity: 0 }, { opacity: 1, duration: 0.46 }, 0.42);
      });

      return () => mm.revert();
    },
    { scope: sceneRef, dependencies: [full] },
  );

  return (
    <section
      ref={sceneRef}
      data-hero-scene
      /*
        One screen by default; the scene length only exists from xl. The value
        comes from the motion tokens rather than the class, so the timeline and
        the spacer cannot drift apart. Reduced motion collapses it back to one
        screen in CSS — see the block in globals.css — because branching on
        matchMedia during render would emit different markup on each side.
      */
      style={{ ["--hero-scene" as string]: `${scene.hero}svh` }}
      className="relative min-h-[100svh] xl:h-[var(--hero-scene)]"
    >
      <div
        /*
          min-height below xl, fixed height from xl.

          The distinction is not cosmetic. Below xl this panel is a real flow
          container — a block of type stacked above a 16:9 band — and its
          content is taller than one screen on any narrow viewport: measured at
          1254x606 the type came to 276px and the band to 697px against a 606px
          panel, so a fixed height clipped 367px off the bottom of the
          photograph. It has to be free to grow.

          From xl the type is the only thing in flow (the photographs are
          absolute) and the height has to be exactly one screen, because the
          scene's travel is `--hero-scene` minus this panel and a panel that
          grew would silently retime the whole sequence.
        */
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 xl:h-[100svh] xl:sticky xl:top-0"
      >
        {/* ------------------------------------------------------ far ------
          Not rendered below xl at all, so a phone never pays for a plate it
          has no composition to show it in.
        */}
        <div
          ref={hillsRef}
          data-parallax-layer
          data-scroll-veil
          aria-hidden="true"
          className="absolute inset-0 z-[2] hidden opacity-0 xl:block"
        >
          <div className="h-full w-full">
            <MouseParallax strength={9}>{hills}</MouseParallax>
          </div>

          {/*
            The hills carry their own wash rather than borrowing the scrim
            below, and it covers the whole frame rather than just the top.

            Two jobs, one gradient. It is a tonal correction first: the
            photograph is high-key tea green and the site is deep forest, so
            unwashed it reads as a stock plate dropped into someone else's
            palette. And it is the type's ground second — measured, because the
            partial scrim this replaces did not reach far enough down. Against
            the composited pixels the type actually covers, at the shortest
            viewport tested (606px, where the block sits lowest in the frame):

              eyebrow    4.38 → 6.9    (11px, needs 4.5)
              headline   4.34 → 10.4   (27px, needs 3)
              support    fails → 8.1   (13px, needs 4.5)
              ghost CTA  2.49 → 6.7    (16px, needs 4.5)

            It never fully clears, because there is no part of this frame that
            is safe to leave at full brightness — the ridge is bright to the
            bottom edge. The floor sits at 0.46 in the middle band and lifts
            again at the foot, which doubles as the vignette the composition
            wants anyway.

            It fades with the layer it belongs to, so it can never be left
            hanging over a commodity.
          */}
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,35,27,0.92)_0%,rgba(16,35,27,0.78)_26%,rgba(16,35,27,0.56)_48%,rgba(16,35,27,0.46)_72%,rgba(16,35,27,0.56)_100%)]"
          />
        </div>

        {/* ------------------------------------------------------ mid ------ */}
        <div
          ref={cloudRef}
          data-parallax-layer
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3] hidden opacity-0 xl:block"
          style={{
            backgroundImage:
              "radial-gradient(120% 62% at 22% 34%, rgba(226,232,214,0.30) 0%, rgba(226,232,214,0) 62%), radial-gradient(90% 48% at 74% 24%, rgba(210,211,182,0.22) 0%, rgba(210,211,182,0) 58%)",
          }}
        />

        {/* ----------------------------------------------------- near ------
          The base layer, and the whole of the section below xl. Two nested
          wrappers on purpose: the outer one is GSAP's (scrubbed depth), the
          inner one is Framer's (the opening fade). Putting both on one node
          would have them writing the same transform.
        */}
        <div
          ref={productRef}
          data-parallax-layer
          className="order-2 z-0 aspect-[16/9] w-full shrink-0 xl:absolute xl:inset-0 xl:order-none xl:aspect-auto"
        >
          <motion.div
            data-reveal
            className="h-full w-full"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.1, ease: easeExpo }}
          >
            <MouseParallax strength={14}>{media}</MouseParallax>
          </motion.div>
        </div>

        {/*
          One scrim, top only, and it now reaches 48% rather than 38%.

          The rule it has always followed is unchanged: it must be fully
          transparent before the nearest bowl rim, so nothing is ever laid over
          a product. What changed is the type — the headline is 62px where it
          was 33px, and the block that used to end around 33% of the screen now
          ends around 44%. A scrim that cleared at 38% left the supporting line
          and both controls sitting on unwashed photograph.

          48% still clears the rim, which sits at roughly 49% of the panel on
          the shortest desktop viewport tested. The stops are redistributed
          rather than merely stretched, so the density where the headline sits
          is what it was and only the tail is longer.
        */}
        <div
          aria-hidden="true"
          data-hero-scrim
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] hidden h-[48%] bg-[linear-gradient(to_bottom,rgba(16,35,27,0.8)_0%,rgba(16,35,27,0.62)_30%,rgba(16,35,27,0.42)_62%,rgba(16,35,27,0.16)_84%,rgba(16,35,27,0)_100%)] xl:block"
        />

        {/* Depth, arriving late. Corners only — nothing crosses a bowl. */}
        <div
          ref={depthRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[4] hidden opacity-0 xl:block"
          style={{
            backgroundImage:
              "radial-gradient(130% 96% at 50% 46%, rgba(16,35,27,0) 52%, rgba(16,35,27,0.34) 82%, rgba(16,35,27,0.6) 100%)",
          }}
        />

        {/* ----------------------------------------------------- type ------ */}
        <div
          ref={typeRef}
          data-scroll-fade
          /*
            Left, and vertically centred from xl.

            It used to be pinned to the top of the panel by a padding, which is
            what made a block this size read as something tucked under the
            header rather than as the composition's anchor. At xl the
            photographs are absolute, so this is the panel's only flow child —
            `flex-1` lets it take the full height and `items-center` centres the
            content inside it. Horizontal alignment is untouched: still hard
            left against the container, still asymmetric, nothing centred
            across the page.

            Below xl the block keeps `items-end`, because there it sits above a
            16:9 band in normal flow and bottom-alignment is what keeps it tight
            to the photograph.
          */
          className="relative z-10 order-1 flex flex-1 items-end pt-24 pb-8 xl:order-none xl:items-center xl:pt-0 xl:pb-0"
        >
          <div className="container-x w-full">
            <LabelReveal tone="dark" onLoad delay={0.55}>
              Wayanad · Kerala · India
            </LabelReveal>

            <LinesReveal
              as="h1"
              lines={LINES}
              onLoad
              delay={0.72}
              step={0.11}
              accentLines={[1]}
              /*
                The measure is wide because the lines are authored, not
                wrapped. <LinesReveal> masks per authored line, so a line that
                wraps inside its own mask reveals as one block and reads as an
                accident. At the 62px ceiling the first line needs ~1030px;
                68rem gives it that at 1280 and above, and 86vw lets it fall to
                two clean lines on a phone instead of breaking mid-phrase.
              */
              className="mt-[clamp(0.85rem,1.4vw,1.7rem)] max-w-[min(68rem,86vw)] font-display text-hero tracking-hero text-cream-50"
            />

            {/*
              Supporting line and controls share a row from sm up, rather than
              stacking. Stacked, the block ran 11px past the pepper bowl's rim at
              1280 — measured, not estimated — and the fix has to come out of
              height, because there is nowhere lower for the type to go. Side by
              side the same content costs one row instead of three.
            */}
            {/*
              Three tiers, and the gap between them is what states the order:
              eyebrow → headline at 1.4vw → this row at 1.6vw. The supporting
              line and the controls still share a row rather than stacking,
              which is now load-bearing rather than tidy — the headline grew by
              29px per line, and stacking these would put the block through the
              pepper bowl's rim at every viewport under 800px tall.
            */}
            <div className="mt-[clamp(1rem,1.6vw,2rem)] flex max-w-[min(58rem,76vw)] flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
              {/*
                Opaque cream-200, not `.text-muted-dark`.

                Same hue and virtually the same value — the difference is the
                0.78 alpha, which is the problem. That utility is verified
                against flat ink bands, where it clears 8.8:1; over a
                photograph the alpha lets the backdrop up into the glyph, so
                the text brightens exactly where the ground does and the
                contrast collapses. Measured on the hills at 606px it came to
                3.92 against a 4.5 requirement. Opaque, the same colour reads
                5.2 there and is unchanged over the commodity frame below xl.
              */}
              <motion.p
                data-reveal
                className="max-w-[min(27rem,36vw)] text-[clamp(0.9375rem,1.1vw,1.1875rem)] leading-[1.65] text-cream-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: easePremium, delay: 1.14 }}
              >
                Reliable sourcing, consistent quality and export-ready supply for
                international buyers.
              </motion.p>

              <motion.div
                data-reveal
                className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: easePremium, delay: 1.3 }}
              >
                <ButtonLink href="/contact#quote" withArrow>
                  Request a Quote
                </ButtonLink>
                <ButtonLink href="/products" variant="ghostDark">
                  Explore products
                </ButtonLink>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
