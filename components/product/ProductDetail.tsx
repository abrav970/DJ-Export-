import { Media } from "@/components/media/Media";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { ProductSpecification } from "@/components/product/ProductSpecification";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/data/products";

/**
 * The body of a product page. Every value is read from the product record, so
 * adding a fourth commodity needs no new components.
 */
export const ProductDetail = ({ product }: { product: Product }) => (
  <>
    {/* Overview + origin */}
    <section className="bg-cream-50 py-24 lg:py-[var(--spacing-section)]">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Overview"
              title={product.tagline}
              description={
                <div className="space-y-5">
                  {product.story.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              }
            />
          </div>

          <div className="lg:col-span-5">
            <Reveal y={28}>
              <div className="border border-ink-900/12 bg-cream-100 p-8 lg:p-10">
                <Eyebrow>Origin</Eyebrow>
                <p className="mt-5 font-display text-2xl leading-snug text-ink-900">
                  {product.origin}
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-700/80">
                  {product.originNote}
                </p>

                <div className="mt-8 space-y-4 border-t border-ink-900/12 pt-6">
                  <DetailRow label="Harvest" value={product.harvest} />
                  <DetailRow label="Category" value={product.category} />
                  <DetailRow label="HS code" value={product.hsCode} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    {/* Specifications + grades */}
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-[var(--spacing-section)]">
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Specifications"
              tone="dark"
              title="What we supply against"
              accentWords={["against"]}
            />
            <ProductSpecification
              className="mt-10"
              specifications={product.specifications}
              tone="dark"
            />
          </div>

          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Available grades"
              tone="dark"
              title="Grades and preparations"
              accentWords={["preparations"]}
            />
            <StaggerGroup as="ul" step={0.08} className="mt-10 border-t border-cream-100/12">
              {product.grades.map((grade) => (
                <StaggerItem
                  as="li"
                  key={grade.name}
                  y={16}
                  className="border-b border-cream-100/12 py-5"
                >
                  <h3 className="font-display text-xl text-cream-100">{grade.name}</h3>
                  <p className="mt-1.5 text-[0.9375rem] text-cream-200/65">{grade.detail}</p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>

    {/* Packing, quality and imagery */}
    <section className="bg-cream-100 py-24 lg:py-[var(--spacing-section)]">
      <div className="container-x">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Packaging" title="Packing options" accentWords={["options"]} />
            <StaggerGroup as="ul" step={0.09} className="mt-9 space-y-6">
              {product.packaging.map((option) => (
                <StaggerItem as="li" key={option.format} y={16}>
                  <h3 className="font-display text-xl text-ink-900">{option.format}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-700/80">
                    {option.detail}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <div className="mt-12">
              <SectionHeading eyebrow="Quality" title="How quality is held" accentWords={["held"]} as="h2" />
              <StaggerGroup as="ul" step={0.08} className="mt-8 space-y-4">
                {product.quality.map((item) => (
                  <StaggerItem as="li" key={item} y={14} className="flex items-start gap-4">
                    <span className="mt-2 h-1 w-1 rotate-45 bg-bronze-600" aria-hidden="true" />
                    <span className="text-[0.9375rem] leading-relaxed text-ink-700/85">{item}</span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>

            <Reveal delay={0.2} className="mt-12">
              <ButtonLink href={`/contact?product=${product.slug}#quote`} variant="light" withArrow>
                Request a Quote
              </ButtonLink>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {product.media.gallery.map((slot, index) => (
                <Reveal
                  key={slot}
                  delay={index * 0.08}
                  className={index === 0 ? "sm:col-span-2" : undefined}
                >
                  <Parallax
                    className={index === 0 ? "aspect-[16/10] w-full" : "aspect-[4/5] w-full"}
                    distance={7}
                  >
                    <Media
                      slot={slot}
                      sizes="(max-width: 640px) 100vw, 30vw"
                      idPrefix={`gallery-${index}`}
                    />
                  </Parallax>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
    <span className="text-[0.6875rem] tracking-[0.22em] text-bronze-700 uppercase">{label}</span>
    <span className="text-[0.9375rem] text-ink-800 sm:text-right">{value}</span>
  </div>
);
