import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustIcon } from "@/components/ui/TrustIcon";
import { trustPoints } from "@/data/company";

export const WhyChooseUs = () => (
  <section className="bg-cream-50 py-24 lg:py-[var(--spacing-section)]">
    <div className="container-x">
      <SectionHeading
        eyebrow="Why buyers work with us"
        title="Dependability, from specification to dispatch"
        accentWords={["dispatch"]}
        align="center"
        description="No overpromising. A clear specification, honest communication and consignments packed and documented the way an importer needs them."
      />

      <StaggerGroup
        as="ul"
        step={0.1}
        className="mt-16 grid gap-px border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {trustPoints.map((point) => (
          <StaggerItem
            as="li"
            key={point.title}
            className="group bg-cream-50 p-8 transition-colors duration-500 hover:bg-cream-100 lg:p-10"
          >
            <span className="inline-block text-bronze-600 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:-translate-y-0.5">
              <TrustIcon name={point.icon} />
            </span>
            <h3 className="mt-6 font-display text-2xl text-ink-900">{point.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-700/80">
              {point.description}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
