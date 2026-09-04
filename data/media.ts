import type { MediaSlot } from "./products";

/**
 * Imagery registry.
 *
 * Every visual on the site is addressed by slot. Swapping a slot to a different
 * photograph is a one-line edit here — no component ever changes.
 *
 * The photography currently in /public/images is REPRESENTATIVE STOCK, not
 * DJ Export's own. See CREDITS.md. Alt text therefore describes what the
 * photograph shows and never claims the estate, store or shipment is ours;
 * SHOTLIST.md is the brief for replacing each one with genuine photography.
 */

export type MediaEntry = {
  src: string | null;
  alt: string;
  /** Shot brief: aspect, subject, light, crop. Mirrored into SHOTLIST.md. */
  spec: string;
  /** object-position for the crop, where the default centre is wrong. */
  position?: string;
};

export const media: Record<MediaSlot, MediaEntry> = {
  "hero-export": {
    src: "/images/process/THE THREE-PRODUCT HERO COMPOSITION.png",
    alt: "Black pepper, green cardamom and coffee beans in three wooden bowls",
    spec: "16:9 landscape, min 2400px. The three commodities in one frame, warm low light on a dark ground.",
    // Anchored to the top of the frame. The picture now fills the whole
    // opening screen, and every pixel trimmed off its top is a pixel of the
    // empty smoke the headline sits on — so the crop comes off the bottom,
    // where there is only ground, and the bowls stay as low in the screen as
    // the frame allows.
    position: "50% 0%",
  },
  plantation: {
    src: "/images/hero/hero background.png",
    alt: "Coffee estate on a Western Ghats hillside at first light",
    spec: "3:4 portrait, min 1600px. Looking into the shade canopy onto coffee in fruit. Dappled natural light, no grading.",
    position: "55% 50%",
  },
  "coffee-cherries": {
    src: "/images/products/coffee-product.jpg",
    alt: "Ripe red coffee cherries on the branch before picking",
    spec: "4:3, min 1600px. Cherries on the branch, shallow depth of field, natural daylight.",
  },
  "coffee-beans": {
    src: "/images/products/coffee-beans.jpg",
    alt: "Cleaned and graded green coffee beans",
    spec: "4:5 portrait, min 1600px. Overhead macro of green beans filling the frame, raked side light for bean texture.",
  },
  "coffee-drying": {
    src: "/images/process/coffee-drying.jpg",
    alt: "Parchment coffee drying on a bamboo mat, husk separating from the bean",
    spec: "16:9, min 2000px. Drying beds or mats, hard daylight, hands welcome, faces not required.",
  },
  "pepper-vine": {
    src: "/images/sourcing/pepper-plantation.jpg",
    alt: "Pepper spikes held at the vine, berries turning from green to red",
    spec: "4:5 portrait, min 1600px. Pepper on the vine against its support tree, natural shade light.",
  },
  peppercorns: {
    src: "/images/products/black-pepper-product.jpg",
    alt: "Dried black peppercorns, showing the wrinkled surface of each berry",
    spec: "4:3, min 1600px. Macro of dried peppercorns, side light so the surface reads. Dark ground, no props.",
  },
  "cardamom-plantation": {
    src: "/images/sourcing/cardamom-plantation.jpg",
    alt: "Cardamom growing in the shaded understory of a high-altitude plantation in Idukki, Kerala",
    spec: "4:5 portrait, min 1600px. Cardamom understory beneath shade trees, cool green light.",
  },
  "cardamom-pods": {
    src: "/images/products/cardamom-product.jpg",
    alt: "Bold green cardamom capsules graded by size",
    spec: "3:4 portrait, min 1600px. Macro of green capsules filling the frame. True natural green — do not saturate.",
  },
  harvest: {
    src: "/images/process/harvest.jpg",
    alt: "Cardamom being hand-picked into collection buckets in Wayanad, India",
    spec: "16:9, min 1800px. Documentary, not staged: real picking, real hands. No posed portraits.",
    position: "50% 45%",
  },
  inspection: {
    src: "/images/process/quality-inspection.jpg",
    alt: "Green coffee beans being sorted by hand on a grading tray",
    spec: "4:5 portrait, min 1800px. Hands over a grading tray, low warm light, product sharp.",
  },
  packing: {
    // Documentary, and licensed: real jute coffee sacks in a working store,
    // stencilled with handling instructions rather than anyone's brand. It
    // replaces a golden-hour warehouse frame whose light was theatrical enough
    // to read as rendered next to the plantation and grading photography.
    src: "/images/process/packaging.jpg",
    alt: "Stacked jute sacks in a store, stencilled with handling instructions",
    spec: "4:5 portrait, min 1800px. Stacked food-grade sacks in a working store. Warm practical light, simple mid-toned composition — it sits behind text.",
    position: "50% 42%",
  },
  logistics: {
    src: "/images/process/LOADING INTO CONTAINER.png",
    alt: "Marked sacks being loaded into a shipping container",
    spec: "16:9 landscape, min 2400px. Containers at port or a container being stuffed. Overcast or early light, documentary — no lens flare, no drone-stock look.",
    position: "50% 60%",
  },
  port: {
    src: "/images/process/CONTAINER  SHIP IMAGE.png",
    alt: "A loaded container ship at berth at sunset",
    spec: "16:9 landscape, min 2400px. The vessel at berth or under way, warm low light, documentary.",
    position: "50% 55%",
  },
  landscape: {
    src: "/images/sourcing/landscape.jpg",
    alt: "Mist moving across a forested hillside in Munnar, Kerala",
    spec: "3:4 portrait, min 1600px. Receding ridge lines with atmospheric haze separating the layers. First light, no built structures.",
  },
};

/**
 * Optional hero video.
 *
 * Leave null to run the still photograph, which is the current setup: a short
 * loop is a multi-megabyte binary and the still keeps LCP fast. To switch, drop
 * the encodes into /public/video and fill this in — <HeroMedia> handles muted /
 * loop / playsInline and uses the hero still as the poster, so nothing else
 * changes. Reduced-motion visitors are served the still either way.
 */
export const heroVideo: { webm: string; mp4: string } | null = null;
