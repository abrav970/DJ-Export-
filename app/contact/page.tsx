import type { Metadata } from "next";
import { Faq } from "@/components/sections/Faq";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";
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
    note: "Best for specifications and documentation queries",
  },
  {
    label: "WhatsApp",
    value: company.contact.whatsapp,
    href: whatsappLink(company.contact.whatsappNumber),
    note: "Quickest route for a first conversation",
  },
  {
    label: "Telephone",
    value: company.contact.phone,
    href: `tel:${company.contact.phone.replace(/\s/g, "")}`,
    note: company.contact.officeHours,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to our export team"
        accentWords={["team"]}
        description="Tell us the product, grade, quantity and destination port. We will come back with what is available, how it will be packed and the terms we can offer."
        slot="logistics"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="bg-cream-50 py-24 lg:py-28">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Get in touch"
                title="Direct lines to the people handling your order"
                accentWords={["order"]}
                description="Enquiries received on a working day are answered within one business day wherever possible."
              />
            </div>

            <div className="lg:col-span-7">
              <StaggerGroup as="ul" step={0.1} className="border-t border-ink-900/12">
                {channels.map((channel) => (
                  <StaggerItem
                    as="li"
                    key={channel.label}
                    className="grid gap-2 border-b border-ink-900/12 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-8"
                  >
                    <span className="text-[0.6875rem] tracking-[0.28em] text-bronze-600 uppercase sm:col-span-3">
                      {channel.label}
                    </span>
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-display text-2xl text-ink-900 transition-colors hover:text-bronze-700 sm:col-span-5"
                    >
                      {channel.value}
                    </a>
                    <span className="text-sm leading-relaxed text-ink-700/70 sm:col-span-4">
                      {channel.note}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              <Reveal delay={0.2} className="mt-10">
                <address className="text-[0.9375rem] leading-relaxed text-ink-700/80 not-italic">
                  <span className="block text-[0.6875rem] tracking-[0.28em] text-bronze-600 uppercase">
                    Registered office
                  </span>
                  <span className="mt-4 block">
                    {company.contact.address.line1}
                    <br />
                    {company.contact.address.line2} — {company.contact.address.postalCode}
                    <br />
                    {company.contact.address.country}
                  </span>
                </address>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <QuoteSection />
      <Faq />
    </>
  );
}
