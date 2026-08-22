import { Media } from "@/components/media/Media";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TextLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    title: "Origin",
    body: "Coffee, pepper and cardamom sourced from the hill districts of southern India.",
  },
  {
    title: "Quality",
    body: "Grades, moisture and cleanliness agreed in writing and checked before shipment.",
  },
  {
    title: "Service",
    body: "Documentation, packing and dispatch handled by the people you correspond with.",
  },
];

/** Editorial introduction — large image with parallax against a short statement. */
export const IntroSection = () => (
  <section className="relative bg-cream-50 py-24 lg:py-[var(--spacing-section)]" id="about">
    <div className="container-x">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Who we are"
            title="We connect India's growing regions with buyers around the world"
            accentWords={["world"]}
            description={
              <>
                <p>
                  DJ Export is an India-based supplier of coffee, black pepper and
                  cardamom for international trade. We work close to the estates and
                  curing houses that produce them, and we sell to the companies that
                  roast, grind, blend and distribute them.
                </p>
                <p className="mt-5">
                  Our work is straightforward: agree a specification, source against
                  it, pack it properly and get it on the water — with the paperwork in
                  order and the buyer kept informed.
                </p>
              </>
            }
          />

          <Reveal delay={0.2} className="mt-9">
            <TextLink href="/about" className="text-ink-900">
              More about the company
            </TextLink>
          </Reveal>

          <StaggerGroup className="mt-12 grid gap-px border border-ink-900/10 bg-ink-900/10 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.title} className="bg-cream-50 p-6">
                <h3 className="text-[0.6875rem] font-sans font-medium tracking-[0.28em] text-bronze-600 uppercase">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700/80">
                  {pillar.body}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <div className="lg:col-span-7">
          <Reveal y={40}>
            <div className="relative">
              <Parallax className="aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[5/6]" distance={10}>
                <Media slot="landscape" sizes="(max-width: 1024px) 100vw, 55vw" />
              </Parallax>

              {/* Caption plate, anchored to the image edge */}
              <div className="relative -mt-16 ml-6 max-w-xs bg-ink-950 p-7 shadow-[var(--shadow-panel)] sm:ml-10 lg:-mt-20">
                <p className="text-[0.6875rem] tracking-[0.28em] text-bronze-400 uppercase">
                  Western Ghats
                </p>
                <p className="mt-4 font-display text-xl leading-snug text-cream-100">
                  Shade, altitude and monsoon — the three things that give Indian
                  coffee and spices their character.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
