import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Compliance } from "@/components/sections/Compliance";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products — Indian Coffee, Black Pepper & Cardamom",
  description:
    "Our export range: Indian coffee in cherry, parchment and plantation preparations, Malabar black pepper, and bold green cardamom — with grades, packing and specifications for each.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our range"
        title="Commodities we export from India"
        accentWords={["India"]}
        description="Three lines, each offered in defined grades with packing and documentation prepared for international shipment."
        slot="hero-export"
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <section className="bg-cream-50 py-24 lg:py-[var(--spacing-section)]">
        <div className="container-x">
          <SectionHeading
            eyebrow="Product range"
            title="Select a commodity for grades and specifications"
            accentWords={["specifications"]}
            description="Every product page carries the specification summary, available grades, packing formats and the quality checks applied before shipment."
          />

          <StaggerGroup step={0.14} className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <StaggerItem key={product.slug} className="h-full">
                <ProductCard
                  product={product}
                  index={index}
                  className="h-[26rem] w-full sm:h-[30rem] lg:h-[36rem]"
                />
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-20 grid gap-10 border-t border-ink-900/12 pt-12 sm:grid-cols-3">
            {products.map((product) => (
              <div key={product.slug}>
                <h3 className="text-[0.6875rem] tracking-[0.28em] text-bronze-600 uppercase">
                  {product.shortName}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-700/80">
                  {product.grades.length} grades · {product.packaging.length} packing formats ·
                  HS {product.hsCode}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Compliance />
      <FinalCta />
    </>
  );
}
