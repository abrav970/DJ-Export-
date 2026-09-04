import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { Faq } from "@/components/sections/Faq";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company, faqs } from "@/data/company";
import { faqJsonLd, JsonLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact & Request a Quote",
  description:
    "Send your product, grade, quantity and destination and our export team will respond with availability, packing options and terms.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    label: "Email",
    value: company.contact.email,
    href: `mailto:${company.contact.email}`,
  },
  {
    label: "WhatsApp",
    value: company.contact.whatsapp,
    href: whatsappLink(company.contact.whatsappNumber),
  },
  {
    label: "Telephone",
    value: company.contact.phone,
    href: `tel:${company.contact.phone.replace(/\s/g, "")}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's discuss your requirement"
        accentWords={["requirement"]}
        description="Whether you are sourcing a specific grade, a commercial quantity or recurring supply, tell us what you need."
        slot="logistics"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/*
        40 / 60 split: the enquiry form is the reason this page exists, so it
        takes the larger half and sits beside the contact details rather than
        in a separate band below them.
      */}
      <section id="quote" className="bg-cream-50 py-[var(--spacing-section)]">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Direct lines"
                title="Talk to our export team"
                accentWords={["team"]}
                description="Enquiries received on a working day are answered within one business day wherever possible."
              />

              <StaggerGroup as="ul" className="mt-10 border-t border-ink-900/12">
                {channels.map((channel) => (
                  <StaggerItem
                    as="li"
                    key={channel.label}
                    y={14}
                    className="border-b border-ink-900/12 py-5"
                  >
                    <span className="text-[0.6875rem] tracking-[0.28em] text-bronze-700 uppercase">
                      {channel.label}
                    </span>
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="mt-2 block font-display text-[1.5rem] leading-snug text-ink-900 transition-colors hover:text-bronze-700"
                    >
                      {channel.value}
                    </a>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              <Reveal delay={0.15} className="mt-8">
                <address className="text-[0.9375rem] leading-relaxed text-muted-light not-italic">
                  <span className="block text-[0.6875rem] tracking-[0.28em] text-bronze-700 uppercase">
                    Registered office
                  </span>
                  <span className="mt-3 block">
                    {company.contact.address.line1}
                    <br />
                    {company.contact.address.line2} — {company.contact.address.postalCode}
                    <br />
                    {company.contact.address.country}
                  </span>
                  <span className="mt-4 block">{company.contact.officeHours}</span>
                </address>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal y={28}>
                <div className="rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-100 p-7 sm:p-10 lg:p-12">
                  <h2 className="font-display text-[1.75rem] leading-tight text-ink-900">
                    Request a Quote
                  </h2>
                  <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-muted-light">
                    Share the product, grade, quantity and destination. We reply
                    with what is available, how it will be packed and the terms
                    we can offer.
                  </p>

                  <div className="mt-9">
                    <QuoteForm tone="light" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Faq />

      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
