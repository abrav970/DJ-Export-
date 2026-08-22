import type { Metadata } from "next";
import { Media } from "@/components/media/Media";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Compliance } from "@/components/sections/Compliance";
import { FinalCta } from "@/components/sections/FinalCta";
import { GlobalSupply } from "@/components/sections/GlobalSupply";
import { PageHero } from "@/components/sections/PageHero";
import { SourceStory } from "@/components/sections/SourceStory";
import { Stats } from "@/components/sections/Stats";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "About — An Indian Agricultural Export Company",
  description:
    "DJ Export sources coffee, black pepper and cardamom from southern India and supplies them to importers, distributors, roasters and food companies internationally.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Specification first",
    body: "Nothing is agreed loosely. Grade, moisture, density, packing and marks are written down before a lot is committed, so what arrives is what was quoted.",
  },
  {
    title: "Close to origin",
    body: "We buy where the crop is cured and graded rather than through long intermediary chains, which keeps quality decisions and pricing transparent.",
  },
  {
    title: "Documentation done properly",
    body: "Export paperwork is prepared carefully and shared early, because a delayed document costs a buyer more than a delayed truck.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About DJ Export"
        title="An export company built around one idea: send exactly what was agreed"
        accentWords={["agreed"]}
        description={company.shortDescription}
        slot="landscape"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="bg-cream-50 py-24 lg:py-[var(--spacing-section)]">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="Our work"
                title="From India's growing regions to your warehouse"
                accentWords={["warehouse"]}
                description={
                  <div className="space-y-5">
                    <p>
                      DJ Export is an India-based agricultural exporter. We source
                      coffee, black pepper and cardamom from the hill districts of
                      southern India and supply them to businesses abroad that roast,
                      grind, blend, pack and distribute.
                    </p>
                    <p>
                      The commodities we handle are ones we know well. Rather than
                      listing a wide catalogue, we keep to three lines and concentrate
                      on getting the grade, the packing and the paperwork right for
                      each shipment.
                    </p>
                    <p>
                      Buyers deal with us directly. The person who quotes your enquiry
                      is the person who follows the lot through packing and dispatch.
                    </p>
                  </div>
                }
              />
            </div>

            <div className="lg:col-span-6">
              <Reveal y={36}>
                <Parallax className="aspect-[4/5] w-full" distance={10}>
                  <Media slot="plantation" sizes="(max-width: 1024px) 100vw, 45vw" />
                </Parallax>
              </Reveal>
            </div>
          </div>

          <StaggerGroup
            as="ul"
            step={0.12}
            className="mt-20 grid gap-px border border-ink-900/10 bg-ink-900/10 lg:grid-cols-3"
          >
            {principles.map((principle) => (
              <StaggerItem as="li" key={principle.title} className="bg-cream-50 p-8 lg:p-10">
                <h3 className="font-display text-2xl text-ink-900">{principle.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-700/80">
                  {principle.body}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <SourceStory
        background={
          <Media slot="coffee-drying" sizes="100vw" idPrefix="source-story" />
        }
      />
      <WhyChooseUs />
      <Stats />
      <Compliance />
      <GlobalSupply />
      <FinalCta />
    </>
  );
}
