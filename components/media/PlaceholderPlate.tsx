import { cn } from "@/lib/utils";

/**
 * Stand-in surface for a media slot with no photograph yet.
 *
 * This is deliberately NOT a "missing image" state. It renders as a quiet tonal
 * plate carrying the logo's thin concentric ring language, so a page with no
 * photography still reads as composed rather than broken.
 *
 * Pure CSS on purpose. The artwork this replaces used inline SVG with Gaussian
 * blur and turbulence filters, which is what made the page composite-bound.
 */
export const PlaceholderPlate = ({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) => {
  const dark = tone === "dark";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-full w-full overflow-hidden",
        dark ? "bg-ink-900" : "bg-cream-200",
        className,
      )}
    >
      {/* Directional ground so the plate has a light source rather than reading flat */}
      <div
        className={cn(
          "absolute inset-0",
          dark
            ? "bg-[radial-gradient(115%_85%_at_50%_0%,#272320_0%,#131110_55%,#0c0b09_100%)]"
            : "bg-[radial-gradient(115%_85%_at_50%_0%,#fbf8f3_0%,#f3ecdf_55%,#e3d7c4_100%)]",
        )}
      />

      {/* Concentric hairline rings, echoing the mark */}
      <div className="absolute top-1/2 left-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2">
        <span
          className={cn(
            "absolute inset-0 rounded-full border",
            dark ? "border-bronze-500/22" : "border-ink-900/12",
          )}
        />
        <span
          className={cn(
            "absolute inset-[14%] rounded-full border",
            dark ? "border-bronze-500/14" : "border-ink-900/8",
          )}
        />
        <span
          className={cn(
            "absolute inset-[30%] rounded-full border",
            dark ? "border-bronze-500/9" : "border-ink-900/6",
          )}
        />
      </div>
    </div>
  );
};
