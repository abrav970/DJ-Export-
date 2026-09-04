import { ProductCard } from "@/components/product/ProductCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/data/products";

/**
 * The product range. Cards carry a photograph, the name and one line — the
 * specifications live on the product pages, which is where a buyer goes to
 * answer a buying question.
 */
export const ProductGrid = ({ id = "products" }: { id?: string }) => (
  <section id={id} className="bg-cream-100 py-[var(--spacing-section)]">
    <div className="container-x">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Our products"
          title="A focused range, prepared for international markets"
          accentWords={["international"]}
        />
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-muted-light lg:pb-2">
          Each line is offered in defined grades and packing formats.
          Specification sheets and samples are shared before an order is confirmed.
        </p>
      </div>

      <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        {products.map((product, index) => (
          <StaggerItem key={product.slug} className="h-full">
            <ProductCard product={product} index={index} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
