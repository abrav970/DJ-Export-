"use client";

import { motion } from "framer-motion";
import { easeExpo, labelReveal, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LabelRevealProps = {
  children: string;
  className?: string;
  /** Colour of the rule and the label. */
  tone?: "dark" | "light";
  delay?: number;
  onLoad?: boolean;
  /** The drawn rule. Dropped where the label is one of a stepped series. */
  rule?: boolean;
};

/**
 * Section label: the rule draws out from nothing while the label opens from
 * tight tracking into its set value.
 *
 * This is deliberately a different gesture from every other reveal on the page.
 * Labels are the smallest type on the site, and translating them the way a
 * heading translates makes them read as debris moving around the heading; a
 * label that resolves typographically stays subordinate to it.
 */
export const LabelReveal = ({
  children,
  className,
  tone = "light",
  delay = 0,
  onLoad = false,
  rule = true,
}: LabelRevealProps) => {
  const trigger = onLoad
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: viewportOnce };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {rule ? (
        <motion.span
          data-reveal
          aria-hidden="true"
          className={cn(
            "h-px w-12 origin-left",
            tone === "dark" ? "bg-bronze-400" : "bg-bronze-600",
          )}
          initial={{ scaleX: 0 }}
          {...(onLoad
            ? { animate: { scaleX: 1 } }
            : { whileInView: { scaleX: 1 }, viewport: viewportOnce })}
          transition={{ duration: 0.9, ease: easeExpo, delay }}
        />
      ) : null}

      <motion.p
        data-reveal
        data-label-reveal
        className={cn(
          "text-[0.6875rem] uppercase",
          tone === "dark" ? "text-bronze-300" : "text-bronze-700",
        )}
        variants={labelReveal}
        initial="hidden"
        transition={{ duration: 1, ease: easeExpo, delay }}
        {...trigger}
      >
        {children}
      </motion.p>
    </div>
  );
};
