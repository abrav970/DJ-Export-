import { Media } from "@/components/media/Media";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { LinesReveal } from "@/components/motion/LinesReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { TextLink } from "@/components/ui/Button";
import { products } from "@/data/products";

/**
 * The range, told editorially.
 *
 * Three full-width spreads rather than three cards in a row. Each one pairs the
 * crop in its own place with a macro of the finished product, so the pair says
 * origin → product without a word: coffee on the branch beside green beans,
 * pepper on the vine beside dried corns, cardamom in the understory beside
 * graded capsules.
 *
 * No borders, no shadows, no badges. The photograph carries the row and the
 * type sits beside it, which is what separates an editorial spread from a
 * catalogue tile.
 *
 * The metadata line is real information — category, HS code, how many grades —
 * not a decorative 01/02/03. A range is not a sequence, so numbering it would
 * be inventing an order the reader does not need.
 *
 * Motion: the wide frame is uncovered from the outer edge of the page, so the
 * wipe travels inward on both sides of an alternating layout rather than
 * repeating the same left-to-right gesture three times. The two photographs in
 * a spread also drift at different speeds — the wide frame at 9%, the macro at
 * 4% — which is what gives the pair depth instead of pasting one on top of the
 * other.
 */

/** Large crop-in-context frame, and the macro that sits inset against it. */
const FRAMES = {
  coffee: { wide: "coffee-cherries", inset: "coffee-beans" },
  "black-pepper": { wide: "pepper-vine", inset: "peppercorns" },
  cardamom: { wide: "cardamom-plantation", inset: "cardamom-pods" },
} as const;

export const ProductStory = () => (
  <section
    id="products"
    /* Ivory, travelling to sand so the journey below is met halfway. */
    className="relative bg-[linear-gradient(to_bottom,#f3efe5_0%,#f3efe5_72%,#e6ddcb_100%)]"
  >
    {/*
      The forest → ivory transition, as a band of its own rather than a wash
      laid over the bottom of the hero photograph. Two reasons it lives here.

      It keeps the picture clean: a gradient painted across the foot of the
      still life tinted the wooden bowls green and read as empty space rather
      than as a change of light.

      And a fixed 8rem is a real distance. The stops used to be percentages of
      this section, whose height depends on how many products are in the
      catalogue — so adding a fourth would have silently stretched the ramp and
      left the bronze eyebrow sitting on moss, where it measures 1.9:1.

      The first stop is #2b2111 rather than the forest the hero sits on: that
      is the measured average of the photograph's last visible row, warm brown
      rather than green. Starting the ramp on the page's colour instead of the
      picture's put a visible rule across the seam.

      The stops rise in luminance the whole way. An earlier set held three dark
      values before opening, which read as a bar of shadow under the photograph
      rather than as the light coming up.
    */}
    <div
      aria-hidden="true"
      className="h-32 w-full bg-[linear-gradient(to_bottom,#2b2111_0%,#2c3a27_20%,#47603f_42%,#7b8f63_62%,#b0b487_78%,#dbd7c6_91%,#f3efe5_100%)]"
    />

    <div className="container-x pt-14 pb-[var(--spacing-section-tight)]">
      <div className="max-w-3xl">
        <LabelReveal>The range</LabelReveal>
        <HeadingReveal
          text="Three commodities, one standard of quality"
          accentWords={["quality"]}
          delay={0.08}
          className="mt-6 font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.1] tracking-[-0.01em] text-ink-950"
        />
      </div>
    </div>

    <div className="space-y-[var(--spacing-section)] pb-[var(--spacing-section)]">
      {products.map((product, index) => {
        const frame = FRAMES[product.slug as keyof typeof FRAMES];
        const flipped = index % 2 === 1;

        return (
          <article key={product.slug} className="group/row container-x">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              {/* -------------------------------------------------- imagery */}
              <div
                className={`relative lg:col-span-7 ${
                  flipped ? "lg:order-2 lg:col-start-6" : "lg:order-1"
                }`}
              >
                <RevealImage
                  className="rounded-[var(--radius-tile)]"
                  from={flipped ? "right" : "left"}
                  scale={1.14}
                >
                  <Parallax className="aspect-[5/4] w-full sm:aspect-[16/10]" distance={9}>
                    {/*
                      Hover moves the crop as well as scaling it: a frame that
                      only grows reads as a zoom control, where a frame that
                      also slides reads as the camera shifting behind it.
                    */}
                    <div className="h-full w-full transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover/row:scale-[1.055] group-hover/row:translate-x-[0.8%]">
                      <Media
                        slot={frame.wide}
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        tone="dark"
                      />
                    </div>
                  </Parallax>
                </RevealImage>

                {/*
                  The macro overlaps the corner of the wide frame. Overlap is the
                  depth device here — no shadow needed to lift it off the band.
                */}
                <Reveal
                  delay={0.28}
                  y={30}
                  className={`absolute bottom-[-3rem] hidden w-[29%] max-w-[11.5rem] sm:block ${
                    flipped ? "left-[-3rem]" : "right-[-3rem]"
                  }`}
                >
                  {/*
                    The keyline is a mount, not a border. Without it the macro
                    reads as a rectangle bitten out of the wide frame, because
                    two photographs meeting edge to edge have no cue that one is
                    laid on the other. A band-coloured keyline supplies it, and
                    lets the plate hang further off the corner so more of the
                    wide frame survives underneath.
                  */}
                  <div className="overflow-hidden rounded-[var(--radius-card)] ring-[5px] ring-cream-50">
                    <Parallax className="aspect-square w-full" distance={4}>
                      <div className="h-full w-full transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover/row:scale-[1.07]">
                        <Media slot={frame.inset} sizes="14rem" tone="dark" />
                      </div>
                    </Parallax>
                  </div>
                </Reveal>
              </div>

              {/* ----------------------------------------------------- type */}
              <div
                className={`lg:col-span-5 ${
                  flipped ? "lg:order-1 lg:col-start-1 lg:row-start-1 lg:pr-6" : "lg:order-2"
                }`}
              >
                <Reveal y={14}>
                  <p className="text-[0.6875rem] tracking-[0.32em] text-bronze-700 uppercase">
                    {product.category} · HS {product.hsCode} · {product.grades.length} grades
                  </p>
                </Reveal>

                <LinesReveal
                  as="h3"
                  lines={[product.shortName]}
                  delay={0.1}
                  className="mt-5 font-display text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.06] tracking-[-0.01em] text-ink-950"
                />

                <Reveal delay={0.2}>
                  <p className="mt-5 max-w-sm text-[1.0625rem] leading-[1.8] text-muted-light">
                    {product.tagline}
                  </p>
                </Reveal>

                <Reveal
                  delay={0.28}
                  className="mt-8 transition-transform duration-700 ease-[var(--ease-premium)] group-hover/row:translate-x-1"
                >
                  <TextLink href={`/products/${product.slug}`} className="text-ink-950">
                    View product
                  </TextLink>
                </Reveal>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);
