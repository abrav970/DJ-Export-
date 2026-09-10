"use client";

import { useMotionPreference } from "@/components/motion/MotionProvider";
import { cn } from "@/lib/utils";

/**
 * "Your system has animations turned off. Show them anyway?"
 *
 * Rendered only when the operating system is actually asking for reduced
 * motion. When it is not, the site is already running its full design and a
 * control offering to enable what is already enabled is noise — so there is
 * nothing to render and nothing to explain.
 *
 * That conditional is also why this is a client component that returns null on
 * the server and on the first client paint: `osReduces` is a media query, and
 * the only honest server value is "unknown". Appearing a frame late in the
 * footer costs nothing; guessing would either flash a control at everyone or
 * hide it from the people who need it.
 *
 * The wording matters more than the widget. "Reduced motion" as a label reads
 * as a setting the reader is being asked to understand; naming the cause —
 * *your system* turned this off — tells them where the decision actually came
 * from, which is the thing they cannot otherwise discover. Turning it on is
 * explicitly their choice and it is reversible in the same place.
 *
 * A button, not a checkbox: it performs an action on the page rather than
 * collecting a value for submission. `aria-pressed` carries the state.
 */
export const MotionToggle = ({ className }: { className?: string }) => {
  const { full, osReduces, setFull } = useMotionPreference();

  if (!osReduces) return null;

  return (
    <button
      type="button"
      onClick={() => setFull(!full)}
      aria-pressed={full}
      className={cn(
        "group inline-flex items-center gap-2.5 text-[0.8125rem] text-muted-dark transition-colors duration-500 hover:text-cream-100",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative block h-3.5 w-7 shrink-0 rounded-full border transition-colors duration-500",
          full ? "border-bronze-400 bg-bronze-500/30" : "border-cream-100/25",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 block h-2 w-2 -translate-y-1/2 rounded-full transition-[left,background-color] duration-500 ease-[var(--ease-premium)]",
            full ? "left-[15px] bg-bronze-300" : "left-[3px] bg-cream-100/50",
          )}
        />
      </span>
      {full ? "Full motion on" : "Your system has animations off — show them"}
    </button>
  );
};
