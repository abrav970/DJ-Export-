import Link from "next/link";
import { Media } from "@/components/media/Media";
import { RevealImage } from "@/components/motion/RevealImage";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Product card: a large photograph over a plain text block on a hairline
 * border. Restrained on purpose — a premium catalogue entry rather than a
 * floating SaaS card, so no gradient, no glass, one shallow elevation step.
 *
 * Hover moves three things and no more: the photograph scales and slides a
 * little behind its frame, its overlay deepens, and the arrow shifts. Nothing
 * tilts, flips or bounces.
 */
export const ProductCard = ({
  product,
  index = 0,
  className,
}: {
  product: Product;
  index?: number;
  className?: string;
}) => (
  <Link
    href={`/products/${product.slug}`}
    // These pages carry the full specification; fetch on click, not on sight.
    prefetch={false}
    className={cn(
      "group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-50 transition-[border-color,box-shadow] duration-500 ease-[var(--ease-premium)] hover:border-ink-900/25 hover:shadow-[var(--shadow-soft)]",
      className,
    )}
  >
    {/* Roughly 55% of the card height — the photograph is the point */}
    <RevealImage className="relative aspect-[4/3] w-full" delay={0.12 + index * 0.12}>
      <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease-premium)] group-hover:scale-[1.05] group-hover:translate-x-[0.7%]">
        <Media
          slot={product.media.hero}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          tone="dark"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink-950/0 transition-colors duration-700 group-hover:bg-ink-950/15"
      />
    </RevealImage>

    <div className="flex flex-1 flex-col p-7">
      <h3 className="font-display text-[1.75rem] leading-tight text-ink-900">
        {product.shortName}
      </h3>

      {/* mb-6 is the floor under `mt-auto` below, which can otherwise collapse
          to nothing when a tagline runs long enough to fill the card. */}
      <p className="mt-2.5 mb-6 text-[0.9375rem] leading-relaxed text-muted-light">
        {product.tagline}
      </p>

      {/*
        The category chip and the "n grades · HS code" line stood here. Both are
        gone rather than replaced: everything they carried is on the list of
        things this site no longer states, and the honest shape of the card is
        one fewer line, not a substitute label invented to fill the slot. The
        rule below still separates the copy from the action, so the card keeps
        its structure — `mt-auto` pins it to the foot whatever the tagline runs to.
      */}
      <span className="mt-auto inline-flex items-center gap-2.5 border-t border-ink-900/12 pt-5 text-[0.6875rem] font-medium tracking-[0.22em] text-ink-900 uppercase">
        View Product
        <svg
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="text-bronze-700 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1"
        >
          <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  </Link>
);
