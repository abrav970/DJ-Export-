import Link from "next/link";
import { Media } from "@/components/media/Media";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { LabelReveal } from "@/components/motion/LabelReveal";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { ProductSpecification } from "@/components/product/ProductSpecification";
import { ButtonLink } from "@/components/ui/Button";
import { company } from "@/data/company";
import { narrativeOrder, type Product, type Specification } from "@/data/products";

/**
 * Where the page stops performing and starts answering.
 *
 * The sequence above is the only part of this site that asks a buyer to watch
 * something. Directly after it, this band puts the three commodities side by
 * side on the terms an importer actually compares them on, in a flat sand
 * ground with no photograph behind the type and no motion beyond the reveals.
 * The change of register is the point: a page that stays cinematic through the
 * commercial section reads as a brochure that is hiding the details.
 *
 * It is a comparison, not a dashboard. There are no cards, no tiles, no
 * counters and no icons — five rows of hairline-ruled type, which is how a
 * specification sheet has always looked and is the fastest thing in the world
 * for a buyer to scan.
 *
 * ---
 *
 * NOTHING HERE IS AUTHORED.
 *
 * Every value is read out of `data/products.ts`. The component chooses *which*
 * dimensions to compare — that is presentation — but it never supplies a
 * figure, and where a product has no value for a dimension the cell prints an
 * em dash rather than a plausible number. `Moisture` in particular is looked
 * up by label out of each product's own specification list, so if that entry
 * is ever renamed the table degrades to a dash instead of quietly showing the
 * wrong row.
 *
 * The caveat under the table is the one <ProductSpecification> already
 * carries, and it is not optional: these are indicative trade grades, and the
 * contract is what binds. Any new specification surface on this site has to
 * repeat it.
 *
 * The compliance line names the two credentials the business actually holds,
 * typographically and with no certification marks. Registration numbers come
 * from `data/company.ts`, where they are deliberately blank until the client
 * supplies them — a number invented to fill a gap here is the single most
 * damaging thing this page could contain. They are shown once, as
 * company-level facts, rather than repeated per commodity, which would imply
 * a per-product certification that does not exist.
 *
 * ---
 *
 * The band is solid sand, `cream-100`, top to bottom. The spreads above end on
 * that value and the journey below opens on it, so a flat fill is what keeps
 * both seams invisible — the same reasoning as <Origin>, arrived at from the
 * opposite direction: there, the neighbours differed and the section had to
 * ramp; here they already agree and the section must not.
 */

/** Looked up by label, and tolerant: a missing entry prints a dash. */
const spec = (product: Product, label: string): string =>
  product.specifications.find((entry) => entry.label === label)?.value ?? "—";

/**
 * The five dimensions all three commodities can be compared on.
 *
 * Deliberately the shared ones. Screen size, density and capsule colour are
 * each meaningful for exactly one of the three, so a column holding them would
 * be two thirds dashes — those live on the product pages, where the full
 * specification for one commodity belongs.
 *
 * Category is not among them: it already sits under each commodity's name in
 * the column head, and a comparison table that repeats a value the reader can
 * see two rows above is padding.
 */
const DIMENSIONS: { label: string; value: (product: Product) => string }[] = [
  { label: "HS code", value: (product) => product.hsCode },
  { label: "Harvest", value: (product) => product.harvest },
  { label: "Moisture", value: (product) => spec(product, "Moisture") },
  { label: "Grades offered", value: (product) => `${product.grades.length}` },
  { label: "Standard packing", value: (product) => product.packaging[0]?.format ?? "—" },
];

/** One column template, shared by the head and every row so they line up. */
const ROW = "grid grid-cols-[minmax(0,11rem)_repeat(3,minmax(0,1fr))] gap-x-10";

const rowsFor = (product: Product): Specification[] =>
  DIMENSIONS.map((dimension) => ({
    label: dimension.label,
    value: dimension.value(product),
  }));

export const ProductSpecs = () => (
  <section id="specifications" className="bg-cream-100 py-[var(--spacing-section)]">
    <div className="container-x">
      <div className="max-w-3xl">
        <LabelReveal>Specifications</LabelReveal>
        <HeadingReveal
          /*
            Three entries, not the phrase. `accentWords` is matched one word at
            a time, so "side by side" normalises to a single token that can
            never equal any word in the heading and the accent silently does
            nothing — which is exactly what it did here until it was caught by
            diffing this heading against every other one on the page.
          */
          text="The three lines, side by side"
          accentWords={["side", "by"]}
          delay={0.08}
          className="mt-6 font-display text-display-md tracking-[-0.01em] text-ink-950"
        />
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.8] text-muted-light">
            The dimensions every enquiry starts from. Full specifications, all
            grades and packing formats are on each product page.
          </p>
        </Reveal>
      </div>

      {/* ---------------------------------------------- lg: comparison ----
        A real table would be the honest element here, but the layout wanted is
        a column per commodity with a photograph and a link in its head, and a
        table cell is a poor host for that. This is a grid with the row labels
        in the first column, which reads identically and stays a list to
        assistive technology — each commodity's values are also repeated as a
        proper definition list in the stacked layout below.
      */}
      <div className="mt-14 hidden lg:block">
        {/* Column heads */}
        <div className={ROW}>
          <div aria-hidden="true" />
          {narrativeOrder.map((product, index) => (
            <div key={product.slug} className="pb-8">
              <MaskedReveal
                from="bottom"
                delay={index * 0.08}
                className="aspect-square w-16 rounded-[var(--radius-control)]"
              >
                <Media slot={product.media.hero} sizes="4rem" tone="dark" />
              </MaskedReveal>

              <Reveal delay={0.1 + index * 0.08} y={14}>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-5 block font-display text-[1.75rem] leading-tight text-ink-950 transition-colors duration-500 hover:text-bronze-700"
                >
                  {product.shortName}
                </Link>
                <span className="mt-1 block text-[0.6875rem] tracking-[0.22em] text-bronze-700 uppercase">
                  {product.category}
                </span>
              </Reveal>
            </div>
          ))}

        </div>

        {/*
          Each row is its own grid rather than all the cells being children of
          one.

          The single-grid version wrapped every row in a <Reveal> carrying
          `display: contents`, so the four cells stayed grid items — and that
          silently killed the animation: an element with `display: contents`
          generates no box, so `transform` and `opacity` have nothing to apply
          to. The rows were visible and completely inert.

          Separate grids sharing one column template align identically, because
          the container width and the gap are the same for all of them, and
          each row is then an ordinary block that can be revealed.
        */}
        {DIMENSIONS.map((dimension, index) => (
          <Reveal key={dimension.label} y={12} delay={index * 0.05} className={ROW}>
            <div className="border-t border-ink-900/12 py-4 text-[0.6875rem] tracking-[0.22em] text-bronze-700 uppercase">
              {dimension.label}
            </div>
            {narrativeOrder.map((product) => (
              <div
                key={product.slug}
                className="border-t border-ink-900/12 py-4 text-[0.9375rem] leading-relaxed text-ink-800"
              >
                {dimension.value(product)}
              </div>
            ))}
          </Reveal>
        ))}

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-light">
          Values are indicative of standard Indian trade grades. Exact figures are
          confirmed per lot and stated in the contract and pre-shipment documents.
        </p>
      </div>

      {/* ------------------------------------------------ below lg: stacked --
        One block per commodity rather than a table squeezed sideways. It reuses
        <ProductSpecification>, which already renders exactly this shape and
        already staggers its rows, so the small-screen treatment is the site's
        existing specification component rather than a second implementation of
        it. The note is printed once, underneath all three.
      */}
      <div className="mt-12 space-y-12 lg:hidden">
        {narrativeOrder.map((product) => (
          <div key={product.slug}>
            <Link
              href={`/products/${product.slug}`}
              className="font-display text-[1.6rem] leading-tight text-ink-950"
            >
              {product.shortName}
            </Link>
            <ProductSpecification
              className="mt-4"
              specifications={rowsFor(product)}
              showNote={false}
            />
          </div>
        ))}

        <p className="text-xs leading-relaxed text-muted-light">
          Values are indicative of standard Indian trade grades. Exact figures are
          confirmed per lot and stated in the contract and pre-shipment documents.
        </p>
      </div>

      {/* ------------------------------------------- compliance + enquiry -- */}
      <div className="mt-16 grid gap-10 border-t border-ink-900/12 pt-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <span className="text-[0.6875rem] tracking-[0.28em] text-bronze-700 uppercase">
            Licences &amp; compliance
          </span>
          <StaggerGroup as="ul" className="mt-6 space-y-5">
            {company.compliance.map((item) => (
              <StaggerItem as="li" key={item.code} y={12} className="flex gap-6">
                <span className="w-16 shrink-0 pt-0.5 text-[0.8125rem] font-medium tracking-[0.2em] text-bronze-700 uppercase">
                  {item.code}
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-muted-light">
                  {item.description}
                  {item.reference ? (
                    <span className="mt-1 block text-[0.8125rem] tracking-[0.16em] text-bronze-700 uppercase">
                      Reg. {item.reference}
                    </span>
                  ) : null}
                </span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <div className="lg:col-span-5">
          <Reveal y={18}>
            <p className="max-w-sm text-[1.0625rem] leading-[1.8] text-muted-light">
              Tell us the product, grade, quantity and destination port and we
              will come back with availability, packing and terms.
            </p>
            <div className="mt-8">
              <ButtonLink href="/contact#quote" variant="light" withArrow>
                Request a Quote
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
