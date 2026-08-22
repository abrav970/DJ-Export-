import { ProductCard } from "@/components/product/ProductCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/data/products";

export const ProductCategories = () => (
  <section id="products" className="relative bg-ink-950 py-24 lg:py-[var(--spacing-section)]">
    <div className="grain absolute inset-0" aria-hidden="true" />

    <div className="container-x relative">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="What we export"
          tone="dark"
          title="Three commodities, sourced with the same discipline"
          accentWords={["discipline"]}
          className="max-w-2xl"
        />
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-cream-200/65 lg:pb-2">
          Each line is offered in defined grades and packing formats. Specification
          sheets and samples are shared before an order is confirmed.
        </p>
      </div>

      <StaggerGroup
        step={0.14}
        className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3"
      >
        {products.map((product, index) => (
          <StaggerItem key={product.slug} className="h-full">
            <ProductCard
              product={product}
              index={index}
              className="h-[26rem] w-full sm:h-[30rem] lg:h-[34rem]"
            />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
