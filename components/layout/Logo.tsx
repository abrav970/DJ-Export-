import Link from "next/link";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * The brand mark, as vector.
 *
 * The site ran on the supplied JPEG until now, and both placements were working
 * around the fact that it was a photograph: the header cropped into it with
 * `scale-[2.18] object-cover` on a dark square, because the artwork's own
 * wordmark is illegible at 44px, and the footer hid the artwork's baked-in dark
 * ground behind a radial `mask-image`. Neither hack survives a transparent SVG,
 * and both are gone.
 *
 * ---
 *
 * WHAT THE SUPPLIED SVG ACTUALLY WAS, AND WHY IT IS NOT SHIPPED AS-IS.
 *
 * The uploaded file is a VTracer auto-trace of the same JPEG — a raster run
 * through an edge tracer — not drawn artwork. Two files were supplied and they
 * are byte-identical (verified by hash), so there is one asset, and it carried:
 *
 *   12,162 <path> elements, 995 KB raw / 118 KB gzipped
 *   a full-canvas #121417 rectangle, i.e. the dark background baked in
 *   coordinates at eight decimal places
 *
 * 99% of those paths are trace noise: specks a few tenths of a pixel across,
 * picked out of JPEG compression artefacts. Only 179 paths have an extent above
 * 16px. Shipping it unchanged would have cost 118 KB gzipped and 12,000 paths of
 * paint on every page, against 6 KB for the JPEG it replaced — twenty times the
 * bytes for a logo that renders no better.
 *
 * So the trace was filtered rather than used raw. Kept: paths with an extent of
 * 10px or more whose fill is light enough to be part of the mark. Dropped: the
 * background rectangle, every dark path (they existed only to paint the ground
 * the mark sat on), and the speck field. Coordinates rounded to one decimal.
 *
 *   full lockup   303 paths, 21.5 KB gzipped
 *   monogram      118 paths, 13.9 KB gzipped
 *
 * Rendered side by side against the 1,335-path version at both header and
 * footer size, the two are indistinguishable. The generator's input is kept at
 * `public/brand/export-2026-09-03 101711.svg` so this is reproducible; if a
 * genuinely drawn vector is ever supplied it should replace both outputs and
 * this whole note.
 *
 * ---
 *
 * Plain <img>, not next/image. `dangerouslyAllowSVG` is off — deliberately,
 * because the optimiser will happily serve a hostile SVG from the same origin —
 * so an SVG cannot go through the image pipeline. There is nothing to optimise
 * anyway: this is already the smallest form of the asset and it is identical at
 * every size and pixel density, which is the whole reason to use it.
 *
 * `width`/`height` are set on both so the box is reserved before the file
 * arrives. The page currently measures CLS 0.0000 and neither of these is
 * allowed to change that.
 */

/** Monogram only, cropped to the mark in the file's own viewBox. */
export const LogoMark = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/brand/dj-export-mark.svg"
    alt=""
    width={505}
    height={498}
    className={cn("block shrink-0", className)}
  />
);

export const Logo = ({
  className,
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) => (
  <Link
    href="/"
    aria-label={`${company.name} — home`}
    className={cn("group flex items-center gap-3", className)}
  >
    <LogoMark className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
    <span className="flex flex-col leading-none">
      <span className="font-display text-[1.05rem] tracking-[0.2em] text-cream-100 transition-colors duration-500 group-hover:text-bronze-200 sm:text-[1.3rem] sm:tracking-[0.24em]">
        DJ EXPORT
      </span>
      {showTagline ? (
        <span className="mt-1.5 text-[0.45rem] tracking-[0.22em] text-bronze-400/80 uppercase sm:text-[0.5rem] sm:tracking-[0.28em]">
          {company.tagline}
        </span>
      ) : null}
    </span>
  </Link>
);

/**
 * The full lockup — mark, wordmark and tagline — used where there is room for
 * it. The artwork carries its own wordmark here, so no type is set beside it.
 */
export const LogoFull = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/brand/dj-export-logo.svg"
    alt={`${company.name} — ${company.tagline}`}
    width={1024}
    height={1024}
    className={cn("h-auto w-full max-w-[260px]", className)}
  />
);
