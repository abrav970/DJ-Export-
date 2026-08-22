import Image from "next/image";
import { media } from "@/data/media";
import type { MediaSlot } from "@/data/products";
import { cn } from "@/lib/utils";
import { scenes } from "./scenes";

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
  /**
   * Scopes the scene's internal SVG ids. Pass a distinct value wherever a page
   * could render the same slot twice, so gradient and filter ids stay unique.
   */
  idPrefix?: string;
};

/**
 * Renders the image for a slot: a real photograph when one is configured,
 * otherwise the vector scene for that slot. Callers never need to know which.
 */
export const Media = ({
  slot,
  className,
  sizes = "100vw",
  priority = false,
  grain = true,
  alt,
  idPrefix,
}: MediaProps) => {
  const entry = media[slot];
  const Scene = scenes[slot];
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
          className="object-cover"
          style={entry.position ? { objectPosition: entry.position } : undefined}
        />
      ) : (
        <div role="img" aria-label={label} className="h-full w-full">
          <Scene id={idPrefix ?? slot} />
        </div>
      )}
    </div>
  );
};
