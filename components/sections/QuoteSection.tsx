import { Suspense } from "react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/utils";

const assurances = [
  "Specification sheet for the grade you need",
  "Packing options and marks confirmed in writing",
  "Indicative pricing and shipment terms",
];

export const QuoteSection = () => (
  <section id="quote" className="relative overflow-hidden bg-ink-900 py-24 lg:py-[var(--spacing-section)]">
    <div className="grain absolute inset-0" aria-hidden="true" />
    <div
      aria-hidden="true"
      className="absolute -bottom-48 -left-32 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(192,138,78,0.14),transparent_65%)]"
    />

    <div className="container-x relative">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Request a quote"
            tone="dark"
            title="Tell us what you need and we will price it"
            accentWords={["price", "it"]}
            description="Share the product, grade, quantity and destination. We reply with what is available, how it will be packed and the terms we can offer."
          />

          <Reveal delay={0.2} className="mt-10">
            <ul className="space-y-4">
              {assurances.map((item) => (
                <li key={item} className="flex items-start gap-4 text-[0.9375rem] text-cream-200/80">
                  <span className="mt-2 h-1 w-1 rotate-45 bg-bronze-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3} className="mt-10 border-t border-cream-100/12 pt-8">
            <p className="text-[0.6875rem] tracking-[0.28em] text-bronze-300/80 uppercase">
              Prefer to write directly
            </p>
            <div className="mt-4 space-y-2 text-[0.9375rem] text-cream-200/80">
              <a href={`mailto:${company.contact.email}`} className="block transition-colors hover:text-bronze-300">
                {company.contact.email}
              </a>
              <a
                href={whatsappLink(company.contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-bronze-300"
              >
                WhatsApp · {company.contact.whatsapp}
              </a>
              <p className="pt-2 text-sm text-cream-200/50">{company.contact.officeHours}</p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal y={32}>
            <div className="border border-cream-100/10 bg-ink-950/60 p-8 backdrop-blur-sm lg:p-12">
              <Suspense fallback={<div className="h-[32rem]" aria-hidden="true" />}>
                <QuoteForm />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
