import { cn } from "@/lib/utils";

/**
 * The seam between two bands, as a change of light.
 *
 * This is the technique the homepage already uses at its one good boundary,
 * extracted so every boundary can use it. It is a server component and a single
 * `<div>` — the "transition" is a gradient, not an animation, and that is the
 * point: a section boundary that has to be animated to feel continuous is not
 * continuous.
 *
 * Three rules are baked in, all of them learned the hard way in
 * `ProductStory`, where this ramp originated:
 *
 * 1. **The band is its own element, not a wash over the section above.** A
 *    gradient painted across the foot of the hero photograph tinted the wooden
 *    bowls green and read as empty space rather than as a change of light.
 *
 * 2. **Its height is a fixed distance, never a percentage.** The stops used to
 *    be percentages of a section whose height depends on how many products are
 *    in the catalogue — so adding a fourth would silently stretch the ramp and
 *    strand the bronze eyebrow on moss, where it measures 1.9:1.
 *
 * 3. **Luminance rises monotonically across the stops.** An earlier set held
 *    three dark values before opening, which read as a bar of shadow under the
 *    photograph rather than as the light coming up.
 *
 * The `forestToIvory` stops are measured, not picked. The first is `#2b2111` —
 * the average of the last visible row of the commodity photograph the opening
 * sequence ends on, warm brown rather than green. Starting the ramp on the
 * page's colour instead of the picture's put a visible rule across the seam.
 * <Origin> now sits between the two and closes on the same value, so the ramp
 * still meets the colour it was tuned against.
 */

export const bandRamps = {
  /**
   * Warm dark ground → the ivory product band. Seven stops; the end stops are
   * measured against the neighbouring sections and must not move. The middle
   * stops are deliberately desaturated olive → greige: the earlier
   * `#7b8f63` / `#b0b487` pair was a saturated yellow-green that read as a
   * lime glow across the seam.
   */
  forestToIvory: [
    "#2b2111 0%",
    "#2f3022 22%",
    "#4a4d38 42%",
    "#7d7e63 60%",
    "#b3b093 78%",
    "#d9d3bd 92%",
    "#f3efe5 100%",
  ],
} as const;

type BandTransitionProps = {
  /** Colour stops, light-side last. Defaults to the measured hero→ivory ramp. */
  stops?: readonly string[];
  /** Fixed height (the default overlaps the section above by 1px to hide the subpixel seam). A real distance, never a percentage — see rule 2 above. */
  className?: string;
};

export const BandTransition = ({
  stops = bandRamps.forestToIvory,
  className = "-mt-px h-24",
}: BandTransitionProps) => (
  <div
    aria-hidden="true"
    className={cn("w-full", className)}
    style={{ backgroundImage: `linear-gradient(to bottom, ${stops.join(", ")})` }}
  />
);
