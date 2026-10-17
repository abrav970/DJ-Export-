import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { company, navigation } from "@/data/company";
import { whatsappLink } from "@/lib/utils";
import { MotionToggle } from "@/components/motion/MotionToggle";
import { LogoFull } from "./Logo";

const year = new Date().getFullYear();

/**
 * Deliberately small. Statement, three links, contact, one CTA, legal line —
 * the footer is a way out of the site, not a second navigation system.
 */
export const Footer = () => (
  <footer className="relative overflow-hidden bg-ink-950 text-cream-200/80">
    <div className="grain absolute inset-0" aria-hidden="true" />

    <div className="container-x relative py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <LogoFull className="-ml-3 w-52" />
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed">
            {company.shortDescription}
          </p>
        </div>

        <div className="lg:col-span-3">
          <FooterHeading>Company</FooterHeading>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="transition-colors duration-300 hover:text-bronze-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <FooterHeading>Contact</FooterHeading>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            <li>
              <a
                href={`mailto:${company.contact.email}`}
                className="transition-colors hover:text-bronze-300"
              >
                {company.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${company.contact.phone.replace(/\s/g, "")}`}
                className="tracking-[0.04em] tabular-nums lining-nums transition-colors hover:text-bronze-300"
              >
                {company.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(company.contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-bronze-300"
              >
                WhatsApp · {company.contact.whatsapp}
              </a>
            </li>
            <li className="pt-1 leading-relaxed text-muted-dark">
              {company.contact.address.line1}
              <br />
              {company.contact.address.line2}, {company.contact.address.country}
            </li>
          </ul>

          <div className="mt-7">
            <ButtonLink href="/contact#quote" withArrow>
              Request a Quote
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-cream-100/10 pt-7 text-[0.8125rem] text-muted-dark sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {company.legalName}. All rights reserved.
        </p>
        {/*
          Renders nothing unless the reader's OS is suppressing motion, so for
          most visitors this row is unchanged. See <MotionToggle>.
        */}
        <MotionToggle />
        <p className="tracking-[0.2em] uppercase">{company.tagline}</p>
      </div>
    </div>
  </footer>
);

const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[0.6875rem] font-sans font-medium tracking-[0.28em] text-cream-100 uppercase">
    {children}
  </h2>
);
