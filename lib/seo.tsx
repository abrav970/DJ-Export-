import { company, siteConfig } from "@/data/company";
import type { Product } from "@/data/products";

export const absoluteUrl = (path = "/"): string =>
  new URL(path, siteConfig.url).toString();

/** Organization / exporter schema used site-wide. */
export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  url: siteConfig.url,
  logo: absoluteUrl("/brand/dj-export-logo.jpg"),
  description: company.shortDescription,
  slogan: company.tagline,
  email: company.contact.email,
  telephone: company.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.contact.address.line1,
    addressLocality: company.contact.address.line2,
    postalCode: company.contact.address.postalCode,
    addressCountry: "IN",
  },
  areaServed: "Worldwide",
  knowsAbout: ["Coffee export", "Black pepper export", "Cardamom export"],
});

export const productJsonLd = (product: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  category: product.category,
  countryOfOrigin: "India",
  brand: { "@type": "Brand", name: company.name },
  url: absoluteUrl(`/products/${product.slug}`),
  additionalProperty: product.specifications.map((spec) => ({
    "@type": "PropertyValue",
    name: spec.label,
    value: spec.value,
  })),
});

export const faqJsonLd = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    // Structured data is generated from our own typed content.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);
