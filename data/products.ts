/**
 * Product catalogue.
 *
 * Specifications, grades and packing are data — never hard-coded into a
 * component — so the catalogue can be edited here or swapped for a CMS later.
 *
 * IMPORTANT: specification values describe standard Indian trade grades and are
 * indicative. Exact figures are confirmed per lot and per contract; every
 * product page states this next to the specification table.
 *
 * ---
 *
 * FIELDS KEPT IN THE DATA BUT DELIBERATELY NOT RENDERED.
 *
 * `harvest`, `category`, `hsCode` and `packaging` are no longer shown anywhere
 * a reader can see them, on the client's instruction. They are kept here rather
 * than deleted because the copy is written, accurate and expected back — losing
 * it would mean re-authoring it from scratch, and the whole point of the data
 * layer is that presentation is the cheap thing to change.
 *
 * So: nothing in `components/` may read these four again without that being a
 * decision. To bring one back, add the render site; the content is already
 * waiting. `category` is the one exception — it still feeds the Product JSON-LD
 * in lib/seo.tsx, which is machine-readable structured data and not a mention
 * on the page.
 */

export type MediaSlot =
  | "hero-export"
  | "wayanad-hills"
  | "shade-canopy"
  | "plantation"
  | "coffee-cherries"
  | "coffee-beans"
  | "coffee-drying"
  | "pepper-vine"
  | "peppercorns"
  | "cardamom-plantation"
  | "cardamom-pods"
  | "harvest"
  | "inspection"
  | "packing"
  | "logistics"
  | "port"
  | "landscape";

export type Specification = {
  label: string;
  value: string;
};

export type Grade = {
  name: string;
  detail: string;
};

export type Packaging = {
  format: string;
  detail: string;
};

export type Product = {
  name: string;
  /** Short label for cards and navigation */
  shortName: string;
  slug: string;
  category: "Coffee" | "Spices";
  /** One-line positioning used on cards */
  tagline: string;
  /** Card + meta description */
  description: string;
  /** Longer editorial copy for the product page */
  story: string[];
  origin: string;
  originNote: string;
  harvest: string;
  specifications: Specification[];
  grades: Grade[];
  packaging: Packaging[];
  quality: string[];
  hsCode: string;
  media: {
    hero: MediaSlot;
    feature: MediaSlot;
    gallery: MediaSlot[];
  };
  /** Accent used for the product's editorial section */
  accent: "bronze" | "ink" | "leaf";
};

export const products: Product[] = [
  {
    name: "Indian Coffee",
    shortName: "Coffee",
    slug: "coffee",
    category: "Coffee",
    tagline: "Robusta and Arabica from shade-grown southern estates",
    description:
      "Indian Robusta and Arabica, cleaned and prepared for roasters and importers.",
    story: [
      "India's coffee grows under shade, on hill slopes where pepper vines and cardamom often share the same estate. That mixed canopy is part of why Indian Robusta carries the body and low acidity that blenders and espresso roasters look for.",
      "We supply both Robusta and Arabica. Samples are shared ahead of confirmation so the cup is agreed before a lot is committed.",
    ],
    origin: "Wayanad, Kerala, India",
    originNote:
      "Sourced from the shade-grown estates of Wayanad, in the Western Ghats of Kerala.",
    harvest: "Robusta: January – March · Arabica: November – February",
    /*
      Screen sizes, moisture and the AB / PB / Plantation designations were
      removed on the client's instruction — they are being confirmed and will be
      reinstated here later. Until then this table says only what is settled, so
      nothing on the page has to be walked back. See the note at the head of the
      file about the fields this catalogue deliberately no longer renders.
    */
    specifications: [
      { label: "Origin", value: "India — Wayanad, Kerala" },
      { label: "Type", value: "Robusta and Arabica" },
      { label: "Cleaning", value: "Cleaned to the agreed specification" },
    ],
    grades: [
      {
        name: "Robusta",
        detail: "Full body and low acidity — the profile Indian Robusta is bought for.",
      },
      {
        name: "Arabica",
        detail: "Higher grown, with a lighter body and a more aromatic cup.",
      },
    ],
    packaging: [
      { format: "60 kg jute bags", detail: "Standard export packing for green coffee" },
      { format: "1 MT jumbo bags", detail: "Food-grade FIBC for bulk movements" },
      { format: "Buyer-marked packing", detail: "Your marks, labels and lot references applied" },
    ],
    quality: [
      "Lots selected against the agreed cup profile",
      "Pre-shipment samples shared for approval",
      "Container inspected and lined where the route requires it",
    ],
    hsCode: "0901",
    media: {
      hero: "coffee-cherries",
      feature: "coffee-beans",
      gallery: ["plantation", "coffee-drying", "packing"],
    },
    accent: "bronze",
  },
  {
    name: "Indian Black Pepper",
    shortName: "Black Pepper",
    slug: "black-pepper",
    category: "Spices",
    tagline: "Bold, dense berries from the Malabar pepper belt",
    description:
      "Garbled and ungarbled Indian black pepper, cleaned and graded to a defined density, moisture and cleanliness specification.",
    story: [
      "Black pepper has moved out of India's Malabar coast for centuries, and the vines still climb the same shade trees on the Western Ghats. Bold berries, high density and a sharp, resinous aroma are what set the origin apart.",
      "We supply Tellicherry graded pepper cleaned to an agreed specification, with density, moisture and extraneous matter confirmed lot by lot for food companies, spice processors and distributors.",
    ],
    origin: "Wayanad, Kerala, India",
    originNote:
      "Sourced from the pepper gardens of Wayanad, in the Malabar region of the Western Ghats.",
    harvest: "December – March",
    specifications: [
      { label: "Origin", value: "India — Wayanad, Kerala" },
      { label: "Grade", value: "Tellicherry garbled — see grades below" },
      { label: "Density", value: "530 – 550 g/l, per grade selected" },
      { label: "Moisture", value: "Max. 12%" },
      { label: "Extraneous matter", value: "Cleaned to the agreed maximum" },
      { label: "Light berries", value: "Limited per grade specification" },
    ],
    /*
      CONFIRM: the detail lines below decode only what each designation itself
      states — TGEB = Tellicherry Garbled Extra Bold, TGSEB = Tellicherry
      Garbled Special Extra Bold, and the GL figure is the bulk density in g/l.
      Bold count, light-berry limits and cleanliness figures are deliberately
      absent because they were not supplied. Add them here once confirmed.
    */
    grades: [
      { name: "TGEB GL-530", detail: "Tellicherry Garbled Extra Bold — 530 g/l bulk density" },
      { name: "TGEB GL-540", detail: "Tellicherry Garbled Extra Bold — 540 g/l bulk density" },
      { name: "TGEB 550 GL", detail: "Tellicherry Garbled Extra Bold — 550 g/l bulk density" },
      { name: "TGSEB 540 GL", detail: "Tellicherry Garbled Special Extra Bold — 540 g/l bulk density" },
    ],
    packaging: [
      { format: "25 kg PP / laminated bags", detail: "Food-grade, stitched and marked" },
      { format: "50 kg jute bags", detail: "Traditional bulk spice packing" },
      { format: "Buyer-marked packing", detail: "Your marks, labels and lot references applied" },
    ],
    quality: [
      "Machine cleaned, de-stoned, gravity separated and garbled",
      "Density and moisture verified against the agreed specification",
      "Samples drawn for buyer approval prior to shipment",
    ],
    hsCode: "0904",
    media: {
      hero: "peppercorns",
      feature: "pepper-vine",
      gallery: ["plantation", "packing", "logistics"],
    },
    accent: "ink",
  },
  {
    name: "Indian Cardamom",
    shortName: "Cardamom",
    slug: "cardamom",
    category: "Spices",
    tagline: "Green cardamom from high-altitude Wayanad plantations",
    description:
      "Bold green cardamom capsules graded by size and colour, dried and packed to hold aroma through the voyage.",
    story: [
      "Small cardamom grows high in the Western Ghats, where cool nights and heavy shade let the capsules fill slowly. Size, colour and aroma are the three things buyers judge, and all three depend on how carefully the crop is picked and dried.",
      "We supply green cardamom graded by capsule size and dried to a controlled moisture, so the volatile oil that carries the aroma survives the voyage.",
    ],
    origin: "Wayanad, Kerala, India",
    originNote:
      "Sourced from high-altitude plantations in Wayanad, in the Western Ghats of Kerala.",
    harvest: "August – February",
    specifications: [
      { label: "Origin", value: "India — Wayanad, Kerala" },
      { label: "Grade", value: "Bold green capsules — see grades below" },
      { label: "Size", value: "6 mm to 8 mm+, per grade selected" },
      { label: "Colour", value: "Natural green, dried without bleaching" },
      { label: "Moisture", value: "Max. 12%" },
      { label: "Volatile oil", value: "Confirmed per lot on request" },
    ],
    grades: [
      { name: "8 mm bold green", detail: "Largest capsules, premium presentation" },
      { name: "7 mm green", detail: "Bold selection for retail and gifting packs" },
      { name: "6 mm green", detail: "Standard export grade for processing and blending" },
      { name: "Mixed / bulk grade", detail: "Assorted sizes for grinding and extraction" },
    ],
    packaging: [
      { format: "5 kg vacuum packs", detail: "Aroma retention for longer voyages" },
      { format: "10 kg laminated cartons", detail: "Lined cartons for bulk movement" },
      { format: "Buyer-marked packing", detail: "Your marks, labels and lot references applied" },
    ],
    quality: [
      "Graded by capsule size on calibrated screens",
      "Dried under controlled conditions to protect colour and aroma",
      "Moisture verified against the agreed specification",
    ],
    hsCode: "0908",
    media: {
      hero: "cardamom-pods",
      feature: "cardamom-plantation",
      gallery: ["plantation", "packing", "logistics"],
    },
    accent: "leaf",
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((product) => product.slug === slug);

export const getRelatedProducts = (slug: string): Product[] =>
  products.filter((product) => product.slug !== slug);

/**
 * The order the range is *told* in, which is not the order it is catalogued in.
 *
 * `products` is coffee-first and drives /products, related products and the
 * Product JSON-LD, so reordering it to suit a narrative would reorder all of
 * those too. The homepage sequence and the specification comparison both read
 * from here instead, so the two always agree about which commodity comes
 * first — they used to hold separate copies of the same list.
 */
export const narrativeOrder: Product[] = ["black-pepper", "coffee", "cardamom"]
  .map(getProductBySlug)
  .filter((product): product is Product => Boolean(product));

/** Options used by the enquiry form's product dropdown. */
export const productOptions = products.map((product) => ({
  value: product.slug,
  label: product.shortName,
}));

