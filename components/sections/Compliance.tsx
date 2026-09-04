import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";

/**
 * Licences and compliance. Deliberately typographic — no certification marks or
 * badges are shown, and registration numbers come from data/company.ts, where
 * they are blank until the client supplies them.
 */
export const Compliance = () => (
  <section className="relative overflow-hidden bg-ink-800 py-[var(--spacing-section)]">
    <div className="grain absolute inset-0" aria-hidden="true" />

    <div className="container-x relative">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Licences & compliance"
            tone="dark"
            title="Export-ready credentials"
            accentWords={["credentials"]}
            description="Operating with the required Indian regulatory and export credentials for our business activities. Documentation references are shared directly with buyers on enquiry."
          />
        </div>

        <StaggerGroup as="ul" className="lg:col-span-7 lg:pt-4">
          {company.compliance.map((item) => (
            <StaggerItem
              as="li"
              key={item.code}
              y={16}
              className="flex flex-col gap-4 border-t border-cream-100/12 py-7 sm:flex-row sm:gap-10 last:border-b"
            >
              <span className="font-sans text-[0.8125rem] font-medium tracking-[0.24em] text-bronze-400 uppercase sm:w-28 sm:shrink-0 sm:pt-1.5">
                {item.code}
              </span>
              <div>
                <h3 className="font-display text-2xl text-cream-100">{item.title}</h3>
                <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-muted-dark">
                  {item.description}
                </p>
                {item.reference ? (
                  <p className="mt-3 text-[0.8125rem] tracking-[0.16em] text-bronze-300 uppercase">
                    Reg. {item.reference}
                  </p>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </div>
  </section>
);
