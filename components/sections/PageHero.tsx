import Link from "next/link";
import { Media } from "@/components/media/Media";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Reveal } from "@/components/motion/Reveal";
import type { MediaSlot } from "@/data/products";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow: string;
  title: string;
  accentWords?: string[];
  description?: string;
  slot: MediaSlot;
  crumbs?: Crumb[];
  children?: React.ReactNode;
};

/** Shared inner-page hero: dark, image-backed, with a breadcrumb trail. */
export const PageHero = ({
  eyebrow,
  title,
  accentWords,
  description,
  slot,
  crumbs = [],
  children,
}: PageHeroProps) => (
  <section className="relative flex min-h-[68svh] items-end overflow-hidden bg-ink-950 pt-40 pb-16 lg:min-h-[76svh] lg:pb-20">
    <div className="absolute inset-0 scale-105">
      <Media slot={slot} priority sizes="100vw" idPrefix="page-hero" />
    </div>
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(100deg,rgba(12,11,9,0.93)_0%,rgba(12,11,9,0.7)_44%,rgba(12,11,9,0.32)_100%)]"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(to_top,rgba(12,11,9,0.92),transparent)]"
    />

    <div className="container-x relative w-full">
      {crumbs.length > 0 ? (
        <Reveal y={10}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[0.6875rem] tracking-[0.2em] text-cream-200/50 uppercase">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-bronze-300">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-cream-100/80">{crumb.label}</span>
                  )}
                  {index < crumbs.length - 1 ? (
                    <span aria-hidden="true" className="text-bronze-500/60">
                      /
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>
      ) : null}

      <Reveal y={12} delay={0.05}>
        <div className="mt-7 flex items-center gap-4">
          <span className="h-px w-10 bg-bronze-500" />
          <p className="eyebrow text-bronze-300">{eyebrow}</p>
        </div>
      </Reveal>

      <HeadlineReveal
        text={title}
        accentWords={accentWords}
        delay={0.2}
        className="mt-6 max-w-4xl text-[clamp(2.5rem,5.6vw,4.5rem)] leading-[1.04] text-cream-50"
      />

      {description ? (
        <Reveal delay={0.5}>
          <p className="mt-7 max-w-2xl text-[1.0625rem] leading-[1.8] text-cream-200/78">
            {description}
          </p>
        </Reveal>
      ) : null}

      {children ? (
        <Reveal delay={0.6}>
          <div className="mt-10">{children}</div>
        </Reveal>
      ) : null}
    </div>
  </section>
);
