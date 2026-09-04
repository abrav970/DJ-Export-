/**
 * Product catalogue.
 *
 * Specifications, grades and packing are data — never hard-coded into a
 * component — so the catalogue can be edited here or swapped for a CMS later.
 *
 * IMPORTANT: specification values describe standard Indian trade grades and are
 * indicative. Exact figures are confirmed per lot and per contract; every
 * product page states this next to the specification table.
 */

export type MediaSlot =
  | "hero-export"
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
      "Indian Robusta and Arabica in cherry, parchment and plantation preparations — cleaned, graded and screened for roasters and importers.",
    story: [
      "India's coffee grows under shade, on hill slopes where pepper vines and cardamom often share the same estate. That mixed canopy is part of why Indian Robusta carries the body and low acidity that blenders and espresso roasters look for.",
      "We supply both Robusta and Arabica, prepared as cherry (natural), parchment (washed) or plantation, and screened to the size the buyer specifies. Samples are shared ahead of confirmation so the cup is agreed before a lot is committed.",
    ],
    origin: "Karnataka, Kerala and Tamil Nadu, India",
    originNote:
      "Sourced from the traditional shade-grown coffee districts of southern India.",
    harvest: "Robusta: January – March · Arabica: November – February",
    specifications: [
      { label: "Origin", value: "India — southern shade-grown belt" },
      { label: "Type", value: "Robusta and Arabica" },
      { label: "Grade", value: "As per buyer requirement — see grades below" },
      { label: "Screen size", value: "Screen 13 to 18, per grade selected" },
      { label: "Moisture", value: "Max. 12.5%" },
      { label: "Processing", value: "Cherry (natural), parchment (washed) or plantation" },
      { label: "Defects", value: "Cleaned and graded to the agreed count" },
      { label: "Packaging", value: "60 kg jute bags or as specified" },
    ],
    grades: [
      { name: "Robusta Cherry AB", detail: "Natural processed, screen 15/16, full body" },
      { name: "Robusta Cherry PB", detail: "Peaberry selection from natural processed lots" },
      { name: "Robusta Parchment AB", detail: "Washed preparation, cleaner cup, screen 15/16" },
      { name: "Arabica Plantation A", detail: "Washed Arabica, screen 17/18" },
      { name: "Arabica Cherry AB", detail: "Natural processed Arabica, screen 15/16" },
      { name: "Bulk / blend grades", detail: "Lower screens and mixed lots for volume blending" },
    ],
    packaging: [
      { format: "60 kg jute bags", detail: "Standard export packing for green coffee" },
      { format: "1 MT jumbo bags", detail: "Food-grade FIBC for bulk movements" },
      { format: "Buyer-marked packing", detail: "Your marks, labels and lot references applied" },
    ],
    quality: [
      "Lots selected against the agreed grade, screen and cup profile",
      "Moisture checked before packing and again before stuffing",
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
    origin: "Kerala and Karnataka, India",
    originNote:
      "Sourced from the Malabar and Western Ghats pepper growing districts.",
    harvest: "December – March",
    specifications: [
      { label: "Origin", value: "India — Malabar / Western Ghats belt" },
      { label: "Grade", value: "Tellicherry garbled — see grades below" },
      { label: "Density", value: "530 – 550 g/l, per grade selected" },
      { label: "Moisture", value: "Max. 12%" },
      { label: "Extraneous matter", value: "Cleaned to the agreed maximum" },
      { label: "Light berries", value: "Limited per grade specification" },
      { label: "Packaging", value: "25 kg / 50 kg food-grade bags" },
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
      "Density and moisture verified before packing",
      "Samples drawn for buyer approval prior to shipment",
      "Packed in food-grade material suited to the transit route",
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
    tagline: "Green cardamom from high-altitude Idukki plantations",
    description:
      "Bold green cardamom capsules graded by size and colour, dried and packed to hold aroma through the voyage.",
    story: [
      "Small cardamom grows high in the Cardamom Hills, where cool nights and heavy shade let the capsules fill slowly. Size, colour and aroma are the three things buyers judge, and all three depend on how carefully the crop is picked and dried.",
      "We supply green cardamom graded by capsule size, dried to a controlled moisture and packed to protect the volatile oil that carries the aroma. Vacuum packing is available for longer voyages and retail-bound lots.",
    ],
    origin: "Idukki, Kerala and the Cardamom Hills, India",
    originNote:
      "Sourced from high-altitude plantations in the Western Ghats cardamom belt.",
    harvest: "August – February",
    specifications: [
      { label: "Origin", value: "India — Idukki / Cardamom Hills" },
      { label: "Grade", value: "Bold green capsules — see grades below" },
      { label: "Size", value: "6 mm to 8 mm+, per grade selected" },
      { label: "Colour", value: "Natural green, dried without bleaching" },
      { label: "Moisture", value: "Max. 12%" },
      { label: "Volatile oil", value: "Confirmed per lot on request" },
      { label: "Packaging", value: "5 kg / 10 kg vacuum or laminated packing" },
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
      "Moisture verified before packing",
      "Vacuum or lined packing selected for the destination and transit time",
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

/** Options used by the enquiry form's product dropdown. */
export const productOptions = products.map((product) => ({
  value: product.slug,
  label: product.shortName,
}));

