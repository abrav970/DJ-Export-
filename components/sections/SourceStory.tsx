"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sourceStory } from "@/data/company";

/**
 * The source-to-shipment story.
 *
 * This is the one place GSAP earns its weight: the connecting rail is drawn
 * with a scrubbed ScrollTrigger so it tracks the scroll position exactly, and
 * each step lights up as the rail reaches it. GSAP is imported dynamically so
 * it never lands in the initial bundle, and reduced-motion users are given the
 * finished state immediately.
 */

type SourceStoryProps = {
  /** Background artwork, rendered by the server */
  background: ReactNode;
};

export const SourceStory = ({ background }: SourceStoryProps) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const run = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced) {
          gsap.set("[data-progress-line]", { scaleX: 1, scaleY: 1 });
          gsap.set(steps, { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          "[data-progress-line]",
          { scaleX: 0, scaleY: 0 },
          {
            scaleX: 1,
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 65%",
              end: "bottom 75%",
              scrub: 0.6,
            },
          },
        );

        steps.forEach((step, index) => {
          // Anything already on screen when GSAP arrives stays as it is —
          // fading it in at that point would read as a flash.
          if (step.getBoundingClientRect().top < window.innerHeight) return;

          gsap.fromTo(
            step,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: index * 0.04,
              scrollTrigger: { trigger: step, start: "top 88%" },
            },
          );
        });
      }, root);

      cleanup = () => context.revert();
    };

    // Only pull GSAP down once this section is within a couple of screens.
    const node = root.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void run();
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-ink-950 py-24 lg:py-[var(--spacing-section)]">
      <div className="absolute inset-0 opacity-45">
        {background}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(12,11,9,0.92),rgba(12,11,9,0.7)_45%,rgba(12,11,9,0.94))]"
      />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="From estate to port"
          tone="dark"
          align="center"
          title="How a lot reaches your warehouse"
          accentWords={["warehouse"]}
          description="Five steps, handled in sequence and documented, so nothing about a shipment is left to assumption."
        />

        <div className="relative mt-20">
          {/* Connecting rail — horizontal on desktop, vertical below */}
          <div
            aria-hidden="true"
            className="absolute top-[1.125rem] left-[1.125rem] hidden h-px w-[calc(100%-2.25rem)] bg-cream-100/12 lg:block"
          >
            <div
              data-progress-line
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-bronze-500 to-bronze-300"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-8 left-[1.125rem] w-px bg-cream-100/12 lg:hidden"
          >
            <div
              data-progress-line
              className="h-full w-full origin-top scale-y-0 bg-gradient-to-b from-bronze-500 to-bronze-300"
            />
          </div>

          <ol className="relative grid gap-12 lg:grid-cols-5 lg:gap-8">
            {sourceStory.map((step) => (
              <li key={step.step} data-step className="relative pl-14 lg:pl-0">
                <span className="absolute top-0 left-0 flex h-9 w-9 items-center justify-center rounded-full border border-bronze-500/50 bg-ink-950 text-[0.625rem] tracking-[0.14em] text-bronze-300 lg:relative lg:mb-8">
                  {step.step}
                </span>
                <h3 className="font-display text-2xl text-cream-100 lg:mt-0">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-cream-200/70">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
