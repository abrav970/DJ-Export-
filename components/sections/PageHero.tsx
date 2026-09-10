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
    {/*
      The plate the type sits on, and it changes axis with the layout because
      the text does.

      The old single gradient ran 100deg from 0.88 to 0.28 and was tuned for a
      headline that stops halfway across. It does not: the <h1> is max-w-3xl,
      which on a 1520px viewport reaches 60% of the section, so its tail was
      landing on the 0.45 end of the ramp. Composited over the photograph and
      measured there, the last characters of "…from India" sat on rgb(43,51,20)
      and the description bottomed out at 4.39:1 — under AA for 17px.

      DESKTOP (lg+) stays directional, which is the point of the composition:
      strong under the column, released across the right so the photograph is
      still a photograph. The falloff now begins at ~68% instead of ~48%, which
      is where the text column actually ends, and the right edge opens further
      than before (0.08 against 0.28) — the plate got more contrast where the
      words are and *less* darkening where they are not.

      BELOW lg it turns vertical, because the directional version solves nothing
      once the column is the full width of the screen. Bottom-aligned type on a
      near-full-bleed frame wants a bottom-up ramp; the top stop is held at 0.36
      rather than pushed higher so the image still opens as an image rather than
      reading as a tinted panel.

      Measured, at the sweep's floor — its darkest frame, so every other frame
      is better — composited over the photograph on all six routes that use
      this component:

        desktop   ivory 6.64–7.62:1   gold 4.90–5.24:1   body 6.44–8.27:1
        below lg  ivory 7.05:1        gold 4.91:1        body 7.35:1

      The lg figures are rendered measurements; the narrow ones are a worst-case
      bound — the brightest pixel anywhere in the lower 74% of the frame, which
      is stronger than any single layout, because the type is free to land on
      any of it. The gold stops were chosen against 4.5:1, the AAA threshold for
      text this size, not the 3:1 AA one.
    */}
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,35,27,0.96)_0%,rgba(16,35,27,0.93)_50%,rgba(16,35,27,0.88)_74%,rgba(16,35,27,0.62)_90%,rgba(16,35,27,0.36)_100%)] lg:bg-[linear-gradient(100deg,rgba(16,35,27,0.95)_0%,rgba(16,35,27,0.9)_40%,rgba(16,35,27,0.82)_62%,rgba(16,35,27,0.5)_78%,rgba(16,35,27,0.2)_92%,rgba(16,35,27,0.08)_100%)]"
    />
    {/*
      Seam scrim, desktop only. The directional gradient above leaves the
      bottom-right corner nearly clear, which is correct for the picture and
      wrong for the edge where it meets the band below. Below lg the vertical
      ramp already lands on 0.95 at the bottom, so adding this there would
      compound to ~0.99 and close the frame off entirely.
    */}
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 hidden h-40 bg-[linear-gradient(to_top,rgba(16,35,27,0.9),transparent)] lg:block"
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
