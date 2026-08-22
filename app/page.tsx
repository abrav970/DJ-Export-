import type { Metadata } from "next";
import { Media } from "@/components/media/Media";
import { Compliance } from "@/components/sections/Compliance";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { GlobalSupply } from "@/components/sections/GlobalSupply";
import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { ProductCategories } from "@/components/sections/ProductCategories";
import { ProductFeature } from "@/components/sections/ProductFeature";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { SourceStory } from "@/components/sections/SourceStory";
import { Stats } from "@/components/sections/Stats";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { faqs } from "@/data/company";
import { getProductBySlug } from "@/data/products";
import { faqJsonLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Indian Coffee, Black Pepper & Cardamom Exporter",
  description:
    "DJ Export supplies premium Indian coffee, black pepper and cardamom to international buyers — defined grades, professional packing and export documentation support.",
  alternates: { canonical: "/" },
};

const coffee = getProductBySlug("coffee")!;
const pepper = getProductBySlug("black-pepper")!;
const cardamom = getProductBySlug("cardamom")!;

export default function HomePage() {
  return (
    <>
      <Hero
        background={
          <Media slot="hero-export" priority sizes="100vw" idPrefix="home-hero" />
        }
      />
      <IntroSection />
      <ProductCategories />

      {/* One editorial feature per commodity, alternating tone and layout */}
      <ProductFeature product={coffee} />
      <ProductFeature product={pepper} tone="dark" reverse />
      <ProductFeature product={cardamom} />

      <WhyChooseUs />
      <Compliance />
      <SourceStory
        background={<Media slot="plantation" sizes="100vw" idPrefix="source-story" />}
      />
      <GlobalSupply />
      <Stats />
      <QuoteSection />
      <Faq />
      <FinalCta />

      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
