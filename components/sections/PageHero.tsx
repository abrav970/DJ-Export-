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
  /**
   * Required. An inner-page hero with nothing but a breadcrumb and one line of
   * type spent the whole first screen saying almost nothing.
   */
  description: string;
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
  <section className="relative flex min-h-[58svh] items-end overflow-hidden bg-ink-950 pt-36 pb-14 lg:pb-16">
    <div className="absolute inset-0 scale-105">
      <Media slot={slot} priority sizes="100vw" tone="dark" />
    </div>
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(100deg,rgba(16,35,27,0.88)_0%,rgba(16,35,27,0.62)_48%,rgba(16,35,27,0.28)_100%)]"
    />
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgba(16,35,27,0.9),transparent)]"
    />

    <div className="container-x relative w-full">
      {crumbs.length > 0 ? (
        <Reveal y={10}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[0.6875rem] tracking-[0.2em] text-muted-dark uppercase">
              {crumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-bronze-300">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-cream-100">{crumb.label}</span>
                  )}
                  {index < crumbs.length - 1 ? (
                    <span aria-hidden="true" className="text-bronze-500">
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
        <div className="mt-6 flex items-center gap-4">
          <span className="h-px w-10 bg-bronze-500" />
          <p className="eyebrow text-bronze-300">{eyebrow}</p>
        </div>
      </Reveal>

      <HeadlineReveal
        text={title}
        accentWords={accentWords}
        delay={0.2}
        className="mt-5 max-w-3xl text-[clamp(2.25rem,4.8vw,3.75rem)] leading-[1.06] text-cream-50"
      />

      <Reveal delay={0.4}>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.75] text-cream-200/85">
          {description}
        </p>
      </Reveal>

      {children ? (
        <Reveal delay={0.5}>
          <div className="mt-8">{children}</div>
        </Reveal>
      ) : null}
    </div>
  </section>
);
