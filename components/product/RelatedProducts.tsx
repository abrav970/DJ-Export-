import { ProductCard } from "@/components/product/ProductCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/data/products";

export const RelatedProducts = ({ products }: { products: Product[] }) => {
  if (products.length === 0) return null;

  return (
    <section className="bg-cream-100 py-[var(--spacing-section-tight)]">
      <div className="container-x">
        <SectionHeading
          eyebrow="Also from our range"
          title="Other commodities we export"
          accentWords={["export"]}
        />

        <StaggerGroup className="mt-10 grid gap-6 md:grid-cols-2">
          {products.map((product, index) => (
            <StaggerItem key={product.slug} className="h-full">
              <ProductCard product={product} index={index} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
};
