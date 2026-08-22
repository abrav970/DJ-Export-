import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";

/**
 * Licences and compliance. Deliberately typographic — no certification marks or
 * badges are shown, and registration numbers come from data/company.ts.
 */
export const Compliance = () => (
  <section className="relative overflow-hidden bg-ink-900 py-24 lg:py-[var(--spacing-section)]">
    <div className="grain absolute inset-0" aria-hidden="true" />
    <div
      aria-hidden="true"
      className="absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(192,138,78,0.16),transparent_65%)]"
    />

    <div className="container-x relative">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Licences & compliance"
            tone="dark"
            title="Export-ready credentials"
            accentWords={["credentials"]}
            description="Operating with the required Indian regulatory and export credentials for our business activities. Documentation references are shared directly with buyers on enquiry."
          />
          <Reveal delay={0.2} className="mt-9">
            <ButtonLink href="/contact?subject=documentation#quote" withArrow>
              Contact Us for Documentation Enquiries
            </ButtonLink>
          </Reveal>
        </div>

        <StaggerGroup as="ul" className="lg:col-span-7 lg:pt-4">
          {company.compliance.map((item) => (
            <StaggerItem
              as="li"
              key={item.code}
              className="flex flex-col gap-5 border-t border-cream-100/12 py-8 sm:flex-row sm:gap-10 last:border-b"
            >
              <span className="font-display text-3xl tracking-[0.14em] text-bronze-400 sm:w-32 sm:shrink-0">
                {item.code}
              </span>
              <div>
                <h3 className="font-display text-2xl text-cream-100">{item.title}</h3>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-cream-200/70">
                  {item.description}
                </p>
                {item.reference ? (
                  <p className="mt-3 text-[0.8125rem] tracking-[0.16em] text-bronze-300/80 uppercase">
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
