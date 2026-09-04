import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buyerTypes } from "@/data/company";

/** Who we supply. A plain list — no cards, no icons. */
export const GlobalSupply = () => (
  <section className="bg-cream-100 py-[var(--spacing-section)]">
    <div className="container-x">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Who we supply"
            title="Built for global buyers"
            accentWords={["buyers"]}
            description="We work with businesses that buy to process, blend, pack or distribute — beginning with a trial quantity where that suits, and scaling to contract volumes as the relationship settles."
          />
        </div>

        <div className="lg:col-span-7">
          <StaggerGroup as="ul" className="border-t border-ink-900/12">
            {buyerTypes.map((buyer, index) => (
              <StaggerItem
                as="li"
                key={buyer.title}
                y={16}
                className="grid gap-2 border-b border-ink-900/12 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-8"
              >
                <span className="text-[0.6875rem] tracking-[0.28em] text-bronze-700 uppercase sm:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[1.5rem] leading-tight text-ink-900 sm:col-span-4">
                  {buyer.title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-light sm:col-span-7">
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
