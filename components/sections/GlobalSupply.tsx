import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buyerTypes } from "@/data/company";

export const GlobalSupply = () => (
  <section className="relative overflow-hidden bg-cream-100 py-24 lg:py-[var(--spacing-section)]">
    <div className="container-x">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Global B2B supply"
            title="Built for global buyers"
            accentWords={["buyers"]}
            description="We work with businesses that buy to process, blend, pack or distribute — beginning with a trial quantity where that suits, and scaling to contract volumes as the relationship settles."
          />

          <Reveal delay={0.15} className="mt-9">
            <ButtonLink href="/contact#quote" variant="light" withArrow>
              Start an Enquiry
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.25} className="mt-12">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Media slot="logistics" sizes="(max-width: 1024px) 100vw, 40vw" />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <StaggerGroup as="ul" step={0.1} className="border-t border-ink-900/12">
            {buyerTypes.map((buyer, index) => (
              <StaggerItem
                as="li"
                key={buyer.title}
                className="group grid gap-3 border-b border-ink-900/12 py-8 sm:grid-cols-12 sm:items-baseline sm:gap-8"
              >
                <span className="text-[0.6875rem] tracking-[0.28em] text-bronze-600 uppercase sm:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[1.75rem] leading-tight text-ink-900 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1 sm:col-span-4">
                  {buyer.title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-ink-700/80 sm:col-span-7">
                  {buyer.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </div>
  </section>
);
