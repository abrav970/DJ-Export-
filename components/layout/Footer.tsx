import Link from "next/link";
import { company, navigation } from "@/data/company";
import { products } from "@/data/products";
import { whatsappLink } from "@/lib/utils";
import { LogoFull } from "./Logo";

const year = new Date().getFullYear();

export const Footer = () => (
  <footer className="relative overflow-hidden bg-ink-950 text-cream-200/70">
    <div className="grain absolute inset-0" aria-hidden="true" />

    <div className="container-x relative py-20 lg:py-24">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <LogoFull className="-ml-3 w-56" />
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed">
            {company.shortDescription}
          </p>
          <p className="mt-6 text-[0.6875rem] tracking-[0.28em] text-bronze-400/70 uppercase">
            {company.origin} · B2B Export
          </p>
        </div>

        <div className="lg:col-span-2">
          <FooterHeading>Company</FooterHeading>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            {navigation.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <FooterHeading>Products</FooterHeading>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            {products.map((product) => (
              <li key={product.slug}>
                <FooterLink href={`/products/${product.slug}`}>
                  {product.shortName}
                </FooterLink>
              </li>
            ))}
            <li>
              <FooterLink href="/contact#quote">Request a Quote</FooterLink>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <FooterHeading>Contact</FooterHeading>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            <li>
              <a href={`mailto:${company.contact.email}`} className="transition-colors hover:text-bronze-300">
                {company.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${company.contact.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-bronze-300">
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
            <li className="pt-2 leading-relaxed text-cream-200/55">
              {company.contact.address.line1}
              <br />
              {company.contact.address.line2} — {company.contact.address.postalCode}
              <br />
              {company.contact.address.country}
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {company.compliance.map((item) => (
              <span
                key={item.code}
                className="border border-bronze-500/25 px-4 py-2 text-[0.6875rem] tracking-[0.2em] text-bronze-300/90 uppercase"
              >
                {item.code}
                {item.reference ? ` · ${item.reference}` : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-cream-100/8 pt-8 text-[0.8125rem] text-cream-200/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {company.legalName}. All rights reserved.
        </p>
        <p className="tracking-[0.2em] uppercase">{company.tagline}</p>
      </div>
    </div>
  </footer>
);

const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[0.6875rem] font-sans font-medium tracking-[0.28em] text-cream-100/90 uppercase">
    {children}
  </h2>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    prefetch={false}
    className="transition-colors duration-300 hover:text-bronze-300"
  >
    {children}
  </Link>
);
