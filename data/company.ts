/**
 * Central company data.
 *
 * Everything a non-developer is likely to want to change lives here: contact
 * details, licence references, trust points and FAQ copy.
 * Values marked PLACEHOLDER must be replaced with the client's real details
 * before the site goes live — nothing here is invented as fact.
 */

export type NavLink = {
  label: string;
  href: string;
};

export const company = {
  name: "DJ Export",
  legalName: "DJ Export",
  tagline: "Delivering Quality Worldwide",
  shortDescription:
    "An India-based exporter of premium coffee, black pepper and cardamom, supplying international buyers with a focus on quality, consistency and dependable export service.",
  origin: "India",
  founded: null as number | null, // PLACEHOLDER — set the year of incorporation

  contact: {
    // PLACEHOLDER — replace with the live business details
    email: "exports@djexport.example",
    phone: "+91 00000 00000",
    whatsapp: "+91 00000 00000",
    /** Digits only, used to build the wa.me link */
    whatsappNumber: "910000000000",
    address: {
      line1: "Registered office address",
      line2: "City, State",
      country: "India",
      postalCode: "000000",
    },
    officeHours: "Monday – Saturday, 09:30 – 18:30 IST",
  },

  /**
   * Regulatory credentials. Registration numbers are intentionally left blank —
   * add them here once confirmed. Nothing is displayed as a certification logo.
   */
  compliance: [
    {
      code: "FSSAI",
      title: "FSSAI Licensed",
      description:
        "Registered with the Food Safety and Standards Authority of India for the food business activities we carry out.",
      reference: "", // PLACEHOLDER — licence number
    },
    {
      code: "IEC",
      title: "Import Export Code",
      description:
        "Holder of an Importer-Exporter Code issued by the Directorate General of Foreign Trade, required for exports from India.",
      reference: "", // PLACEHOLDER — IEC number
    },
  ],

  socials: [] as { label: string; href: string }[], // PLACEHOLDER — add profiles when available
} as const;

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.djexport.example",
  title: "DJ Export — Indian Coffee, Black Pepper & Cardamom Exporter",
  description: company.shortDescription,
  locale: "en_IN",
} as const;

/**
 * Primary navigation. Deliberately three items plus the standing CTA — the
 * logo carries the route home, so "Home" does not need a slot, and the product
 * dropdown was removed because the products index is one click away.
 */
export const navigation: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type TrustPoint = {
  title: string;
  description: string;
  icon: "leaf" | "origin" | "document" | "package" | "handshake" | "message";
};

/**
 * Credibility strip shown once, directly under the hero. One line each — this
 * is a scanning aid, not a features section.
 */
export const trustPoints: TrustPoint[] = [
  {
    icon: "origin",
    title: "Premium Indian origin",
    description: "Sourced from India's established coffee and spice growing belts.",
  },
  {
    icon: "leaf",
    title: "Quality-focused sourcing",
    description: "Bought against a written specification and checked lot by lot.",
  },
  {
    icon: "document",
    title: "Export-ready supply",
    description: "Food-grade packing and shipping documentation prepared for the route.",
  },
  {
    icon: "message",
    title: "Direct communication",
    description: "You deal with the people handling your order, start to finish.",
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

/** Source → Inspect → Prepare → Export. */
export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Source",
    description:
      "Lots selected at estate and curing-house level against the grade and specification agreed with the buyer.",
  },
  {
    step: "02",
    title: "Inspect",
    description:
      "Cleaning, grading and moisture checks, with samples shared for approval before a lot is confirmed.",
  },
  {
    step: "03",
    title: "Prepare",
    description:
      "Food-grade packing chosen for the commodity and the voyage, palletised and marked to your instructions.",
  },
  {
    step: "04",
    title: "Export",
    description:
      "Documentation prepared, container stuffed and dispatched, with shipment details shared through to arrival.",
  },
];

export type BuyerType = {
  title: string;
  description: string;
};

export const buyerTypes: BuyerType[] = [
  {
    title: "Importers & distributors",
    description:
      "Container-load supply against contract specifications and agreed shipment schedules.",
  },
  {
    title: "Coffee roasters",
    description:
      "Indian Robusta and Arabica in cherry, parchment and plantation preparations, with samples ahead of commitment.",
  },
  {
    title: "Food & spice companies",
    description:
      "Black pepper and cardamom to a defined density, moisture and cleanliness specification for processing and packing.",
  },
  {
    title: "Wholesalers",
    description:
      "Bulk lots in standard export packing, with buyer marks and documentation prepared for onward sale.",
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "What products do you export?",
    answer:
      "We export three commodity lines from India: coffee (Robusta and Arabica), black pepper and cardamom. Each is offered in the grades and packing formats listed on its product page.",
  },
  {
    question: "Do you work with international buyers?",
    answer:
      "Yes. We supply importers, distributors, wholesalers, roasters and food companies outside India, and we are happy to begin with a trial quantity before larger contracts.",
  },
  {
    question: "Can I request product specifications?",
    answer:
      "Yes. Tell us the product and grade you are interested in and we will share the specification sheet for the lot available, along with a sample where required.",
  },
  {
    question: "Can I request a quotation?",
    answer:
      "Use the enquiry form with your product, quantity, destination port and packing preference. We reply with pricing and shipment terms based on what is available at that time.",
  },
  {
    question: "Do you provide product packaging options?",
    answer:
      "We pack in food-grade jute, PP or vacuum formats depending on the commodity and route, and can apply your marks and labelling. Alternative packing can be arranged on request.",
  },
  {
    question: "How can I contact your export team?",
    answer:
      "Send the enquiry form, email us, or message us on WhatsApp. Enquiries received on a working day are answered within one business day wherever possible.",
  },
];
