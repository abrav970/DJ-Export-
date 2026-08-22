import { Media } from "@/components/media/Media";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ProductSpecification } from "@/components/product/ProductSpecification";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductFeatureProps = {
  product: Product;
  /** Alternates the editorial layout down the page */
  reverse?: boolean;
  tone?: "dark" | "light";
  /** Number of specification rows to show in the summary */
  specLimit?: number;
};

/**
 * Editorial feature block used once per commodity on the homepage. The same
 * component drives all three sections; only data and tone change.
 */
export const ProductFeature = ({
  product,
  reverse = false,
  tone = "light",
  specLimit = 6,
}: ProductFeatureProps) => (
  <section
    id={product.slug}
    className={cn(
      "relative py-24 lg:py-[var(--spacing-section)]",
      tone === "dark" ? "bg-ink-950" : "bg-cream-100",
    )}
  >
    <div className="grain absolute inset-0" aria-hidden="true" />

    <div className="container-x relative">
      <div
        className={cn(
          "grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-20",
          reverse && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div className="lg:col-span-6">
          <Reveal y={36}>
            <div className="relative">
              <Parallax className="aspect-[4/5] w-full sm:aspect-[3/2] lg:aspect-[4/5]" distance={9}>
                <Media
                  slot={product.media.feature}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </Parallax>

              <div
                className={cn(
                  "absolute -bottom-6 flex items-center gap-4 px-6 py-4 shadow-[var(--shadow-lift)]",
                  reverse ? "right-6 lg:-right-8" : "left-6 lg:-left-8",
                  tone === "dark" ? "bg-cream-100" : "bg-ink-950",
                )}
              >
                <span className="text-[0.6875rem] tracking-[0.28em] text-bronze-500 uppercase">
                  HS Code
                </span>
                <span
                  className={cn(
                    "font-display text-lg",
                    tone === "dark" ? "text-ink-900" : "text-cream-100",
                  )}
                >
                  {product.hsCode}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <SectionHeading
            eyebrow={`${product.category} · Indian origin`}
            tone={tone}
            title={product.name}
            description={
              <div className="space-y-5">
                {product.story.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            }
          />

          <Reveal delay={0.1} className="mt-10">
            <h3
              className={cn(
                "text-[0.6875rem] font-sans font-medium tracking-[0.28em] uppercase",
                tone === "dark" ? "text-cream-100/70" : "text-ink-900/60",
              )}
            >
              Specification summary
            </h3>
          </Reveal>

          <ProductSpecification
            className="mt-5"
            specifications={product.specifications.slice(0, specLimit)}
            tone={tone}
          />

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink
              href={`/contact?product=${product.slug}#quote`}
              variant={tone === "dark" ? "primary" : "light"}
              withArrow
            >
              Request Specification
            </ButtonLink>
            <TextLink
              href={`/products/${product.slug}`}
              className={tone === "dark" ? "text-cream-100/80" : "text-ink-900/80"}
            >
              Full product details
            </TextLink>
          </div>
        </div>
      </div>
    </div>
  </section>
);
