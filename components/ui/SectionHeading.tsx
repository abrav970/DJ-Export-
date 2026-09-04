import type { ReactNode } from "react";
import { HeadingReveal } from "@/components/motion/HeadingReveal";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  accentWords?: string[];
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h2" | "h3";
  className?: string;
  children?: ReactNode;
};

/**
 * Shared section header: eyebrow label, hairline rule, masked headline and an
 * optional supporting paragraph.
 */
export const SectionHeading = ({
  eyebrow,
  title,
  accentWords,
  description,
  align = "left",
  tone = "light",
  as = "h2",
  className,
  children,
}: SectionHeadingProps) => (
  <div
    className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}
  >
    {eyebrow ? (
      <Reveal y={12}>
        <div
          className={cn(
            "flex items-center gap-4",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-bronze-500/60" />
          <span
            className={cn(
              "eyebrow",
              tone === "dark" ? "text-bronze-300" : "text-bronze-700",
            )}
          >
            {eyebrow}
          </span>
        </div>
      </Reveal>
    ) : null}

    {/*
      Section heads sit a controlled step below the hero rather than competing
      with it — the impact belongs to the hero display size, not to every h2.
    */}
    <HeadingReveal
      as={as}
      text={title}
      accentWords={accentWords}
      accentClassName={
        tone === "dark" ? "text-bronze-400 italic" : "text-bronze-700 italic"
      }
      className={cn(
        "mt-5 text-[clamp(1.875rem,3.8vw,2.875rem)] leading-[1.12]",
        tone === "dark" ? "text-cream-100" : "text-ink-900",
      )}
    />

    {description ? (
      <Reveal delay={0.1}>
        <div
          className={cn(
            "mt-5 text-[1.0625rem] leading-[1.75]",
            tone === "dark" ? "text-muted-dark" : "text-muted-light",
          )}
        >
          {description}
        </div>
      </Reveal>
    ) : null}

    {children}
  </div>
);
