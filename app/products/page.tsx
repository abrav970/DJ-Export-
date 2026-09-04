import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { QuoteCta } from "@/components/sections/QuoteCta";

export const metadata: Metadata = {
  title: "Products — Indian Coffee, Black Pepper & Cardamom",
  description:
    "Our export range: Indian coffee in cherry, parchment and plantation preparations, Tellicherry black pepper, and bold green cardamom — with grades, packing and specifications for each.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our range"
        title="Commodities we export from India"
        accentWords={["India"]}
        description="Three lines, each offered in defined grades with packing and documentation prepared for international shipment. Select a commodity for its full specification."
        slot="hero-export"
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <ProductGrid id="range" />

      <QuoteCta
        title="Need a specification or a sample?"
        accentWords={["sample?"]}
      />
    </>
  );
}
