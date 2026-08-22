import type { ReactNode } from "react";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
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
    className={cn(
      "max-w-3xl",
      align === "center" && "mx-auto text-center",
      className,
    )}
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
              tone === "dark" ? "text-bronze-300" : "text-bronze-600",
            )}
          >
            {eyebrow}
          </span>
        </div>
      </Reveal>
    ) : null}

    <HeadlineReveal
      as={as}
      trigger="inView"
      text={title}
      accentWords={accentWords}
      delay={0.05}
      className={cn(
        "mt-5 text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.08]",
        tone === "dark" ? "text-cream-100" : "text-ink-900",
      )}
    />

    {description ? (
      <Reveal delay={0.15}>
        <div
          className={cn(
            "mt-6 text-[1.0625rem] leading-[1.75]",
            tone === "dark" ? "text-cream-200/75" : "text-ink-700/80",
          )}
        >
          {description}
        </div>
      </Reveal>
    ) : null}

    {children}
  </div>
);
