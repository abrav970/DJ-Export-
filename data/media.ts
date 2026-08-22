import type { MediaSlot } from "./products";

/**
 * Imagery registry.
 *
 * Every visual on the site is addressed by slot. Until the client supplies
 * photography, each slot renders an art-directed vector scene drawn in the
 * brand palette. To switch a slot to a real photograph, drop the file into
 * /public/images and set `src` — the <Media> component does the rest
 * (next/image, sizing, lazy-loading and alt text all stay the same).
 */

export type MediaEntry = {
  /** e.g. "/images/coffee-cherries.jpg" — leave undefined to use the vector scene */
  src?: string;
  alt: string;
  /** Focal point for photographs */
  position?: string;
};

export const media: Record<MediaSlot, MediaEntry> = {
  "hero-export": {
    alt: "Sunrise over terraced hill estates in southern India, where our coffee and spices are grown",
  },
  plantation: {
    alt: "Shade-grown plantation with coffee bushes beneath a tree canopy",
  },
  "coffee-cherries": {
    alt: "Ripe coffee cherries on the branch before picking",
  },
  "coffee-beans": {
    alt: "Cleaned and graded green coffee beans",
  },
  "coffee-drying": {
    alt: "Coffee drying on raised beds in the sun",
  },
  "pepper-vine": {
    alt: "Black pepper vines climbing shade trees, with spikes of green peppercorns",
  },
  peppercorns: {
    alt: "Graded Indian black peppercorns",
  },
  "cardamom-plantation": {
    alt: "Cardamom plants growing in the shaded understory of a high-altitude plantation",
  },
  "cardamom-pods": {
    alt: "Bold green cardamom capsules graded by size",
  },
  packing: {
    alt: "Marked export sacks stacked and ready for stuffing",
  },
  logistics: {
    alt: "Containers at port with trade routes reaching international markets",
  },
  landscape: {
    alt: "Layered ridge lines of India's Western Ghats at first light",
  },
};
