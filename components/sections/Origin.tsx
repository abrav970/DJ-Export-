import { Media } from "@/components/media/Media";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubLayer } from "@/components/motion/ScrubLayer";
import { parallax } from "@/lib/motion";

/**
 * Where the crop comes from — the beat the homepage did not have.
 *
 * The page used to go straight from the opening frame into the range, so the
 * reader met three commodities before they were told anything about where any
 * of it grows. This section is that missing sentence, and it has one job:
 * establish Wayanad as a place, then hand over to the products.
 *
 * It is deliberately not a farming story. No sunrise over a field, no hands in
 * soil, no talk of tradition or passion — a buyer sourcing a container of
 * pepper is not moved by any of it, and the site's credibility comes from
 * sounding like a trading company that knows its origin rather than a brand
 * performing authenticity. Two short paragraphs: what the place is, and how we
 * buy from it.
 *
 * ---
 *
 * DEPTH, IN THREE PLANES AND TWO SPEEDS.
 *
 *   far    the ridge, travelling at the base parallax rate
 *   near   a single bush under canopy, at less than half that rate
 *   air    two soft fields of light behind both, fixed
 *
 * The two photographs are the whole argument. `parallax.base` against
 * `parallax.subtle` is a 9%-to-4% difference, which is small enough that
 * nobody notices it as movement and large enough that the pair stops reading
 * as two pictures pasted on one background. Overlap does the rest: the near
 * frame is laid across the corner of the far one on a band-coloured mount, the
 * same device the product spreads use, so the depth is carried by the
 * composition rather than by a shadow.
 *
 * Both frames are uncovered rather than faded — <MaskedReveal>, wiping from
 * opposite edges so the pair does not arrive as one gesture, with the near
 * frame a beat behind. This is the first section on the site to use the
 * primitives phase 2 built; nothing new was needed for it.
 *
 * ---
 *
 * THE TWO SEAMS.
 *
 * This section was inserted between two things that already met cleanly, so
 * its background has to do the work of not being noticed at either end.
 *
 * It opens on #1f1913, which is measured rather than inherited.
 *
 * The ramp below this section starts on #2b2111 and is documented as "the
 * average of the hero photograph's last visible row". That value no longer
 * describes anything: rendered and sampled across seven realistic desktop
 * aspect ratios, the actual last visible row of the commodity frame comes out
 * between #1e1912 and #251d14 — darker, at every single one, than the #2b2111
 * that was meeting it. The old seam therefore had a faint light bar under the
 * photograph, which was invisible while the ramp immediately climbed away from
 * it into green and became obvious the moment a flat band held the value.
 *
 * The reason the number drifts at all is that the frame is `object-cover` with
 * `object-position: 50% 0%`, so the crop comes off the bottom and which row is
 * last depends on the viewport's aspect ratio. No single constant can be right
 * everywhere. #1f1913 sits at the mode of that spread and below all but the
 * widest case, which is the safe direction to be wrong in: a band very
 * slightly darker than the picture above it reads as the picture falling into
 * shadow, where a lighter one reads as two panels that do not match.
 *
 * The 18% first leg is short for the same reason — the less time the eye is
 * given to compare the two values, the less any residual difference matters.
 *
 * It closes on #2b2111 as well, which is the first stop of the ramp at the top
 * of <ProductStory>. That ramp was tuned when the hero sat directly above it;
 * ending here on the colour it expects means it still meets the right value
 * and did not have to be touched. The section travels down to the site's deep
 * forest in between, so the reader passes through a dip in the light rather
 * than across two edges.
 */
export const Origin = () => (
  <section
    id="origin"
    className="relative overflow-hidden bg-[linear-gradient(to_bottom,#1f1913_0%,#10231b_18%,#10231b_100%)]"
  >
    {/*
      Air. Two fields, one cool and high on the left, one warm and low on the
      right, both wide and weak enough to read as depth in the band rather than
      as lighting. Pure CSS: an atmospheric layer that costs a decode and a
      composite is not atmosphere, it is a third photograph.
    */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(70% 46% at 12% 18%, rgba(110,132,98,0.20) 0%, rgba(110,132,98,0) 68%)",
      }}
    />

    <div className="container-x relative py-[var(--spacing-section)]">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ------------------------------------------------------- type ---- */}
        <div className="lg:col-span-5">
          <LabelReveal tone="dark">Origin</LabelReveal>

          <HeadingReveal
            text="Wayanad, in the Western Ghats"
            accentWords={["Wayanad"]}
            accentClassName="text-bronze-300 italic"
            delay={0.08}
            className="mt-6 font-display text-display-md tracking-[-0.01em] text-cream-50"
          />

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-[1.8] text-muted-dark">
              Pepper, coffee and cardamom from Wayanad — a highland district in
              the Western Ghats of Kerala, where elevation, shade canopy and a
              long monsoon shape what the crop becomes.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-[1.8] text-muted-dark">
              We buy where the crop is grown and cured, close to the estates,
              rather than through a chain of intermediaries.
            </p>
          </Reveal>
        </div>

        {/* ----------------------------------------------------- frames ---- */}
        <div className="relative lg:col-span-7">
          {/*
            Far. Wiped open from the right, which is the outer edge of the page
            on this layout — the same rule the product spreads follow, so a
            reveal always travels inward rather than in whichever direction the
            component happens to default to.
          */}
          <MaskedReveal
            from="right"
            className="aspect-[5/4] w-full rounded-[var(--radius-tile)] sm:aspect-[16/10]"
          >
            <ScrubLayer distance={parallax.base} className="h-full w-full">
              <Media
                slot="wayanad-hills"
                sizes="(max-width: 1024px) 100vw, 58vw"
                tone="dark"
              />
            </ScrubLayer>
          </MaskedReveal>

          {/*
            Near, and only from lg. Below that it is a second stacked frame
            (see the mobile block underneath) rather than an overlap: a plate
            hung off the corner of another plate needs room on both sides of it
            to read as depth, and on a phone there is none — it just crops the
            picture it is sitting on.

            The mount is the band's own colour rather than the ivory the
            product spreads use, because it is a mount, not a border: without
            it two photographs meeting edge to edge have no cue that one is laid
            on the other.
          */}
          <div className="absolute -bottom-10 -left-10 hidden w-[30%] max-w-[13rem] lg:block">
            <MaskedReveal
              from="left"
              delay={0.18}
              className="aspect-[4/5] w-full rounded-[var(--radius-card)] ring-[6px] ring-ink-950"
            >
              <ScrubLayer distance={parallax.subtle} className="h-full w-full">
                {/* Not rendered below lg, so it must not be fetched there. */}
                <Media
                  slot="shade-canopy"
                  sizes="(min-width: 1024px) 14rem, 1px"
                  loading="lazy"
                  tone="dark"
                />
              </ScrubLayer>
            </MaskedReveal>
          </div>
        </div>

        {/*
          Mobile: the closer frame as its own step, wide and short so it reads
          as a change of distance rather than as a second portrait. Same two
          photographs, same order, no overlap.
        */}
        <div className="lg:hidden">
          <MaskedReveal
            from="left"
            className="aspect-[16/9] w-full rounded-[var(--radius-tile)]"
          >
            <ScrubLayer distance={parallax.subtle} className="h-full w-full">
              {/*
                The mirror of the guard on the lg frame above. Without it every
                desktop visitor downloads a full-width plate for markup their
                viewport never renders — the note on <Media>'s `loading` prop
                is about exactly this pair.
              */}
              <Media
                slot="shade-canopy"
                sizes="(max-width: 1023px) 100vw, 1px"
                loading="lazy"
                tone="dark"
              />
            </ScrubLayer>
          </MaskedReveal>
        </div>
      </div>
    </div>
  </section>
);
