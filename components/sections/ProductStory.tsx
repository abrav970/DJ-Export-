import { Media } from "@/components/media/Media";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { LinesReveal } from "@/components/motion/LinesReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { RevealImage } from "@/components/motion/RevealImage";
import { ProductSequence, type SequenceItem } from "@/components/sections/ProductSequence";
import { TextLink } from "@/components/ui/Button";
import { narrativeOrder } from "@/data/products";

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
 * A metadata line above each name used to carry category, HS code and a grade
 * count. All three are now off the site, and it was deliberately not replaced:
 * the slot existed because there was real information for it, and filling it
 * with a decorative 01/02/03 would be inventing an order a range does not have.
 * Name, origin and tagline carry the spread on their own.
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

const sequenceItems: SequenceItem[] = narrativeOrder.map((product) => {
  const frame = FRAMES[product.slug as keyof typeof FRAMES];

  return {
    slug: product.slug,
    name: product.shortName,
    origin: product.origin,
    tagline: product.tagline,
    wide: <Media slot={frame.wide} sizes="(min-width: 1024px) 58vw, 1px" tone="dark" />,
    macro: <Media slot={frame.inset} sizes="(min-width: 1024px) 14rem, 1px" tone="dark" />,
  };
});

export const ProductStory = () => (
  <section
    id="products"
    /* Ivory, travelling to sand so the journey below is met halfway. */
    className="relative bg-[linear-gradient(to_bottom,#ece5d2_0%,#ece5d2_72%,#e6ddcb_100%)]"
  >
    <div className="container-x pt-[var(--spacing-section)] pb-[var(--spacing-section-tight)]">
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

    {/*
      From lg the range is a pinned sequence: one held spread that the three
      commodities pass through. See <ProductSequence>.
    */}
    <div className="pb-[var(--spacing-section)]">
      <ProductSequence items={sequenceItems} />
    </div>

    {/*
      Below lg, the same three spreads stacked — the authored small-screen
      treatment, not a fallback. Pinning a viewport-height stage on a phone is
      how a page stops feeling scrollable, so the sequence is simply not
      rendered there and this is.

      It follows the narrative order rather than the catalogue order, so the
      story a phone reader is told is the one a desktop reader is told.
    */}
    <div className="space-y-[var(--spacing-section)] pb-[var(--spacing-section)] lg:hidden">
      {narrativeOrder.map((product, index) => {
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
                        sizes="(max-width: 1023px) 100vw, 1px"
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
                  /*
                    The horizontal hang is smaller than the page gutter, and
                    that is a bug fix rather than a taste change.

                    This block only ever renders below lg, where the image is
                    the full container width — so an offset of -3rem put the
                    macro 48px outside its own column, against a gutter of 20px
                    below md and 40px above it. Nothing on the page clips it
                    (`html` and `body` are both `overflow-x: visible`), so every
                    viewport from 640px to 1023px got a horizontal scrollbar and
                    28px, or 8px, of the plate hanging off the edge of the
                    screen.

                    16px and 32px both sit inside their gutter. The vertical
                    overhang is untouched: there is nothing to collide with
                    below, and it is the half of the offset that actually
                    carries the overlap.
                  */
                  className={`absolute bottom-[-3rem] hidden w-[29%] max-w-[11.5rem] sm:block ${
                    flipped ? "left-[-1rem] md:left-[-2rem]" : "right-[-1rem] md:right-[-2rem]"
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
                        <Media slot={frame.inset} sizes="(max-width: 1023px) 14rem, 1px" tone="dark" />
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
                <LinesReveal
                  as="h3"
                  lines={[product.shortName]}
                  delay={0.1}
                  className="font-display text-[clamp(2.1rem,3.6vw,3rem)] leading-[1.06] tracking-[-0.01em] text-ink-950"
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
