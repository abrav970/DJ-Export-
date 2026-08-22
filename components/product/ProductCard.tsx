import Link from "next/link";
import { Media } from "@/components/media/Media";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Large product card. The image scales, the scrim deepens and the CTA shifts on
 * hover — all transform/opacity only.
 */
export const ProductCard = ({
  product,
  index,
  className,
}: {
  product: Product;
  index: number;
  className?: string;
}) => (
  <Link
    href={`/products/${product.slug}`}
    // These pages carry large inline artwork; fetch them on click, not on sight.
    prefetch={false}
    className={cn(
      "group relative block overflow-hidden bg-ink-950",
      className,
    )}
  >
    <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-[1.06]">
      <Media
        slot={product.media.hero}
        sizes="(max-width: 768px) 100vw, 33vw"
        idPrefix={`card-${product.slug}`}
      />
    </div>

    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,11,9,0.95)_6%,rgba(12,11,9,0.55)_46%,rgba(12,11,9,0.12)_100%)] transition-opacity duration-700 group-hover:opacity-90"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(192,138,78,0.28),transparent_60%)]"
    />

    <div className="relative flex h-full flex-col justify-end p-8 lg:p-9">
      <span className="text-[0.6875rem] tracking-[0.28em] text-bronze-300/80 uppercase">
        {String(index + 1).padStart(2, "0")} · {product.category}
      </span>

      <h3 className="mt-4 font-display text-[2rem] leading-tight text-cream-50">
        {product.shortName}
      </h3>

      <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-200/75">
        {product.tagline}
      </p>

      <span className="mt-7 inline-flex items-center gap-2.5 text-[0.6875rem] font-medium tracking-[0.22em] text-cream-100 uppercase">
        <span className="relative">
          Explore Products
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-bronze-400 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-x-100" />
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1.5"
        >
          <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  </Link>
);
