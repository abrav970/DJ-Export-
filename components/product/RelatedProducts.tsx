import { ProductCard } from "@/components/product/ProductCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/data/products";

export const RelatedProducts = ({ products }: { products: Product[] }) => {
  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-28">
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Also from our range"
          tone="dark"
          title="Other commodities we export"
          accentWords={["export"]}
        />

        <StaggerGroup step={0.12} className="mt-14 grid gap-5 md:grid-cols-2">
          {products.map((product, index) => (
            <StaggerItem key={product.slug}>
              <ProductCard
                product={product}
                index={index}
                className="h-[24rem] w-full sm:h-[28rem]"
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
};
