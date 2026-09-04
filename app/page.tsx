import type { Metadata } from "next";
import { Media } from "@/components/media/Media";
import { Crossing } from "@/components/sections/Crossing";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { ProductStory } from "@/components/sections/ProductStory";
import { QuoteCta } from "@/components/sections/QuoteCta";

export const metadata: Metadata = {
  title: "Indian Coffee, Black Pepper & Cardamom Exporter",
  description:
    "DJ Export supplies premium Indian coffee, black pepper and cardamom to international buyers — defined grades, professional packing and export documentation support.",
  alternates: { canonical: "/" },
};

/**
 * One passage, not five sections.
 *
 *   origin → product → estate → harvest → quality → packing → export →
 *   crossing → enquiry
 *
 * Every boundary is a change of light rather than a cut: the hero lifts through
 * moss into the product spreads, the spreads settle into sand, the journey
 * travels sand → olive → moss → forest, and the crossing opens already at deep
 * forest where the journey ended. There is no dark-to-light flip anywhere.
 */
export default function HomePage() {
  return (
    <>
      <Hero media={<Media slot="hero-export" priority sizes="100vw" tone="dark" />} />
      <ProductStory />
      <Journey />
      <Crossing />
      <QuoteCta />
    </>
  );
}
