import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/dj-export-logo.jpg";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

/**
 * The supplied logo artwork is used unmodified. In compact placements the mark
 * is framed to the monogram (the artwork's own wordmark is too small to read at
 * header size) and set beside the company name in the brand's letterforms.
 */
export const LogoMark = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "relative block shrink-0 overflow-hidden rounded-[3px] bg-ink-950",
      className,
    )}
  >
    <Image
      src={logo}
      alt=""
      fill
      sizes="64px"
      priority
      className="scale-[2.18] object-cover origin-[50%_41%]"
    />
  </span>
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
    <LogoMark className="h-10 w-10 sm:h-11 sm:w-11" />
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
 * Full supplied artwork, used where there is room for it (footer, meta).
 * The soft edge mask lets the artwork's own dark ground melt into the section
 * behind it instead of reading as a pasted rectangle.
 */
export const LogoFull = ({ className }: { className?: string }) => (
  <Image
    src={logo}
    alt={`${company.name} — ${company.tagline}`}
    className={cn(
      "h-auto w-full max-w-[260px] [mask-image:radial-gradient(66%_54%_at_50%_47%,#000_42%,transparent_88%)]",
      className,
    )}
    sizes="260px"
    placeholder="blur"
  />
);
