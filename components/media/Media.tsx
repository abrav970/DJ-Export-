import Image from "next/image";
import { media } from "@/data/media";
import type { MediaSlot } from "@/data/products";
import { cn } from "@/lib/utils";
import { PlaceholderPlate } from "./PlaceholderPlate";

type MediaProps = {
  slot: MediaSlot;
  className?: string;
  /** Passed to next/image when a photograph is configured for the slot */
  sizes?: string;
  priority?: boolean;
  /** Adds the paper-grain overlay used across the site */
  grain?: boolean;
  /** Overrides the alt text from data/media.ts where context needs it */
  alt?: string;
  /** Band this sits in — only affects the placeholder plate's palette */
  tone?: "dark" | "light";
  /**
   * Pass "lazy" for markup that only renders at one breakpoint. A hidden <img>
   * is still fetched — so a `lg:hidden` mobile list costs every desktop visitor
   * the full download of images they will never see. Lazy loading is the fix:
   * the browser skips anything that is not going to be painted.
   */
  loading?: "lazy" | "eager";
};

/**
 * Renders the image for a slot: the photograph when one is configured in
 * data/media.ts, otherwise a tonal placeholder plate. Callers never branch on
 * which — switching a slot to a photograph is a data edit, never a code edit.
 */
export const Media = ({
  slot,
  className,
  sizes = "100vw",
  priority = false,
  grain = true,
  alt,
  tone = "dark",
  loading,
}: MediaProps) => {
  const entry = media[slot];
  const label = alt ?? entry.alt;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", grain && "grain", className)}>
      {entry.src ? (
        <Image
          src={entry.src}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          loading={loading}
          className="object-cover"
          style={entry.position ? { objectPosition: entry.position } : undefined}
        />
      ) : (
        <div role="img" aria-label={label} className="h-full w-full">
          <PlaceholderPlate tone={tone} />
        </div>
      )}
    </div>
  );
};
