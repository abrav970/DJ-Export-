import type { Metadata } from "next";
import { Media } from "@/components/media/Media";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Compliance } from "@/components/sections/Compliance";
import { GlobalSupply } from "@/components/sections/GlobalSupply";
import { PageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { QuoteCta } from "@/components/sections/QuoteCta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "About — An Indian Agricultural Export Company",
  description:
    "DJ Export sources coffee, black pepper and cardamom from southern India and supplies them to importers, distributors, roasters and food companies internationally.",
  alternates: { canonical: "/about" },
};

const pillars = [
  {
    title: "Source",
    body: "We buy where the crop is cured and graded, close to the estates in India's southern hill districts, rather than through long intermediary chains.",
  },
  {
    title: "Quality",
    body: "Grade, moisture, density and packing are agreed in writing before a lot is committed, and checked again before it ships.",
  },
  {
    title: "Export",
    body: "Commercial and shipping paperwork is prepared carefully and shared early, because a delayed document costs a buyer more than a delayed truck.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About DJ Export"
        title="Connecting quality Indian produce with global markets"
        accentWords={["global", "markets"]}
        description={company.shortDescription}
        slot="landscape"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Who we are */}
      <section className="bg-cream-50 py-[var(--spacing-section)]">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="Who we are"
                title="An export company built around one idea"
                accentWords={["idea"]}
                description={
                  <div className="space-y-5">
                    <p>
                      DJ Export is an India-based agricultural exporter. We source
                      coffee, black pepper and cardamom from the hill districts of
                      southern India and supply them to businesses abroad that
                      roast, grind, blend, pack and distribute.
                    </p>
                    <p>
                      Rather than listing a wide catalogue we keep to three lines
                      and concentrate on getting the grade, the packing and the
                      paperwork right. The person who quotes your enquiry is the
                      person who follows the lot through packing and dispatch.
                    </p>
                  </div>
                }
              />
            </div>

            <div className="lg:col-span-6">
              <Reveal y={32}>
                <Parallax
                  className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-tile)]"
                  distance={10}
                >
                  <Media
                    slot="plantation"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    tone="dark"
                  />
                </Parallax>
              </Reveal>
            </div>
          </div>

          {/* What we do */}
          <StaggerGroup
            as="ul"
            className="mt-16 grid gap-x-12 gap-y-10 border-t border-ink-900/12 pt-12 lg:grid-cols-3"
          >
            {pillars.map((pillar) => (
              <StaggerItem as="li" key={pillar.title} y={18}>
                <h2 className="text-[0.6875rem] font-sans font-medium tracking-[0.28em] text-bronze-700 uppercase">
                  {pillar.title}
                </h2>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-light">
                  {pillar.body}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <Process />
      <GlobalSupply />
      <Compliance />
      <QuoteCta />
    </>
  );
}
