import type { MediaSlot } from "./products";

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

export type ComplianceItem = {
  /** Short designation, used as the label when no emblem is supplied. */
  code: string;
  title: string;
  description: string;
  /** Registration number, exactly as issued. Never invented, never reformatted. */
  reference: string;
  /**
   * Path to the issuing body's official emblem, under /public.
   *
   * Blank means "not supplied yet", and the section falls back to the
   * typographic label it has always used — so an entry is never broken or
   * half-rendered while the file is being sourced.
   *
   * These are third-party government marks, so they are referenced as files
   * the client provides rather than drawn, traced or fetched here: an emblem
   * that DJ Export cannot evidence is a claim, not a decoration. Drop the file
   * into /public/brand and set the path — no component change is needed.
   */
  logo: string;
  /** Accessible name for the emblem. Required whenever `logo` is set. */
  logoAlt: string;
};

/**
 * Regulatory credentials.
 *
 * All three references below were supplied by the client on 10 Sep 2026 and are
 * reproduced exactly as given. Nothing here is normalised, reformatted or
 * corrected — these are legal identifiers, and a transcription "fix" applied by
 * a developer is indistinguishable from an error until someone checks it
 * against the certificate.
 *
 * TWO OF THEM SHOULD BE CHECKED AGAINST THE CERTIFICATES.
 *
 *   IEC   Given as CKFPJ312OH. Since 2017 the IEC is the firm's PAN, and PAN is
 *         formatted AAAAA9999A — five letters, four *digits*, one letter. The
 *         ninth character here is a letter O where the format wants a digit,
 *         and the GSTIN below embeds the same PAN as CKFPJ3120H with a zero.
 *         The two cannot both be right; the zero is the one that fits the
 *         format.
 *
 *   GST   Given as CKFPJ3120H1ZQ, which is 13 characters. A GSTIN is 15: a
 *         two-digit state code, then the 10-character PAN, then an entity
 *         digit, a literal Z and a checksum. What is present matches the tail
 *         of a valid GSTIN exactly, so the missing piece looks like the leading
 *         state code (Kerala is 32) rather than anything inside it.
 *
 * Both are left as supplied rather than repaired here. Confirm and correct in
 * this file — it is the only place either number appears.
 *
 * <Compliance> renders the emblem where one exists and the designation as type
 * where it does not, so an entry without a logo is complete rather than broken.
 */
export const compliance: ComplianceItem[] = [
  {
    code: "FSSAI",
    title: "FSSAI Licensed",
    description:
      "Registered with the Food Safety and Standards Authority of India for the food business activities we carry out.",
    reference: "11326999000745",
    /*
      Blank on the client's instruction — the entry renders as the "FSSAI"
      label, the same treatment IEC and GST get, and the licence number below
      still does the work of evidencing it.

      Note if this is ever set again: the supplied /brand/FSSAI.webp is not
      usable as-is. It is a lossy VP8 webp, a format with no alpha channel, with
      a transparency checkerboard baked in as real pixels — measured, 84% of it
      was neutral light grey alternating with white, so it renders as a grid on
      any background. It needs that background flattened first, or better, a
      genuine transparent PNG or an SVG from FSSAI.
    */
    logo: "",
    logoAlt: "Food Safety and Standards Authority of India",
  },
  {
    code: "IEC",
    title: "Import Export Code",
    description:
      "Holder of an Importer-Exporter Code issued by the Directorate General of Foreign Trade, required for exports from India.",
    reference: "CKFPJ312OH", // VERIFY — see the note above; likely CKFPJ3120H
    logo: "", // No emblem supplied. Renders as the "IEC" label.
    logoAlt: "Directorate General of Foreign Trade",
  },
  {
    code: "GST",
    title: "GST Registered",
    description:
      "Registered under the Goods and Services Tax regime in India, with tax invoices issued against the registration below.",
    reference: "CKFPJ3120H1ZQ", // VERIFY — 13 characters; a GSTIN is 15
    logo: "", // No emblem supplied. Renders as the "GST" label.
    logoAlt: "Goods and Services Tax",
  },
];

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
    email: "connect.djexport@gmail.com",
    phone: "+91 85905 14834",
    whatsapp: "+91 85905 14834",
    /** Digits only, used to build the wa.me link */
    whatsappNumber: "918590514834",
    address: {
      line1: "P28F+RPP, Cheriyamkolly",
      line2: "Keralam 670645",
      country: "India",
      postalCode: "670645",
    },
    officeHours: "Monday – Saturday, 09:30 – 18:30 IST",
  },

  compliance,

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

export type SourcingStage = {
  id: string;
  /**
   * 01–05. Stated rather than implied: a buyer reading a sourcing story wants
   * to know how many steps there are and which one they are looking at, and an
   * unnumbered passage makes them count.
   */
  step: string;
  label: string;
  title: string;
  body: string;
  slot: MediaSlot;
};

/**
 * Source → Select → Assess → Prepare → Export: the homepage sourcing passage.
 *
 * This copy was previously hard-coded inside `Journey.tsx`, which is the one
 * thing this project's content layer exists to prevent. It lives here now, so
 * the sourcing story can be edited without opening a component.
 *
 * ---
 *
 * WHAT THIS DELIBERATELY DOES NOT SAY.
 *
 * DJ Export buys, selects, prepares and ships. It does not farm, and nothing
 * here may imply that it does — no estate ownership, no farmer programmes, no
 * agronomy. "Bought where it grows" is a trading claim and is the strongest
 * origin statement this copy is entitled to make.
 *
 * Equally: no certification is named, no laboratory or test method is claimed,
 * and no traceability guarantee is offered. The quality stage describes the
 * two things that are actually verifiable to a buyer — checks against the
 * agreed specification, and a sample they approve before the lot is confirmed.
 * The previous copy read "Nothing leaves unchecked", which is an absolute
 * testing claim this business cannot substantiate; a claim a buyer could hold
 * against a contract is worse than a quiet sentence.
 *
 * ---
 *
 * ON THE OVERLAP WITH `processSteps`.
 *
 * The two are close in wording because they describe the same operation at two
 * granularities: `processSteps` is the four-step summary on /about, this is the
 * five-step passage on the homepage, where Source and Select are separate
 * beats. They are not derivable from one another (the collapse is lossy), so
 * they are two arrays — but they must be edited together. If the operation
 * changes, change both.
 */
export const sourcingStages: SourcingStage[] = [
  {
    id: "source",
    step: "01",
    label: "Source",
    title: "Bought where it grows",
    body: "Coffee, black pepper and cardamom sourced in Wayanad, Kerala — the Western Ghats belt whose altitude, shade and monsoon give the crop its character.",
    slot: "plantation",
  },
  {
    id: "select",
    step: "02",
    label: "Select",
    title: "Chosen lot by lot",
    body: "Lots are selected at estate and curing-house level against the grade and specification agreed with the buyer, before anything is committed.",
    slot: "harvest",
  },
  {
    id: "assess",
    step: "03",
    label: "Assess",
    title: "Checked before it is confirmed",
    body: "Cleaning, grading and moisture checks against the agreed specification, with samples shared for your approval before a lot is confirmed for shipment.",
    slot: "inspection",
  },
  {
    id: "prepare",
    step: "04",
    label: "Prepare",
    title: "Prepared for the voyage",
    body: "Food-grade packing chosen for the commodity and the route, palletised and marked to your instructions.",
    slot: "packing",
  },
  {
    id: "export",
    step: "05",
    label: "Export",
    title: "Loaded and documented",
    body: "Documentation prepared, container stuffed and dispatched, with shipment details shared through to arrival.",
    slot: "logistics",
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
      "Indian Robusta and Arabica, with samples shared ahead of commitment.",
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
      "We export three commodity lines from India: coffee (Robusta and Arabica), black pepper and cardamom. Each is offered in the grades listed on its product page.",
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
