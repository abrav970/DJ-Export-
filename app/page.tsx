import type { Metadata } from "next";
import { Media } from "@/components/media/Media";
import { Crossing } from "@/components/sections/Crossing";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Origin } from "@/components/sections/Origin";
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
 *   opening → origin → product → source → select → assess → prepare →
 *   export → crossing → enquiry
 *
 * Every boundary is a change of light rather than a cut: the hero travels from
 * the hill estates into the commodities and hands its last frame to <Origin>,
 * which opens on that photograph's own colour and closes on it again; the
 * spreads then settle into sand, which <ProductSpecs> holds flat so the one
 * band on the page that is pure information reads as a change of register
 * rather than a change of scene; the journey picks that same sand up and
 * travels sand → olive → moss → forest, and the crossing opens already at deep
 * forest where the journey ended. There is no dark-to-light flip anywhere.
 *
 * The last two bands share one value — #10231b — and hold it flat. The crossing
 * closes on it and <QuoteCta> is it, so nothing is ramped there because there is
 * nothing to ramp between.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        media={<Media slot="hero-export" priority sizes="100vw" tone="dark" />}
        /*
          The far plane. `priority` because from xl it is the opening frame and
          therefore the largest contentful paint.

          The `sizes` breakpoint is doing real work. The layer is `hidden`
          below xl, and a hidden <img> is still fetched — so without this a
          phone would download a full-width plate for a composition it never
          renders. Declaring 1px under xl makes the browser resolve the
          smallest candidate in the srcset instead, which is also what the
          preload `priority` emits will ask for.

          THIS 1280 MUST TRACK <Hero>'s BREAKPOINT. They are the same decision
          written in two files, and getting them out of step does not fail
          loudly — it silently serves a 16px-wide plate into a full-bleed
          layer, which reads as a blurry background rather than as an error.
          Ask why this number is here before changing either one.
        */
        hills={
          <Media
            slot="wayanad-hills"
            priority
            sizes="(min-width: 1280px) 100vw, 1px"
            tone="dark"
          />
        }
      />
      <Origin />
      <ProductStory />
      <Journey />
      <Crossing />
      <QuoteCta />
    </>
  );
}
