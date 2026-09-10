import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/data/company";

/**
 * Licences and compliance.
 *
 * Each entry shows the issuing body's official emblem where the client has
 * supplied one, and falls back to the designation set as type where they have
 * not. Both come from `compliance` in data/company.ts; nothing is drawn, traced
 * or fetched here, because a government mark this company cannot evidence would
 * be a claim rather than a decoration.
 *
 * As it stands every entry takes the typographic route — the FSSAI emblem was
 * fitted and then removed again on the client's instruction, so all three now
 * show their designation beside the registration number. The emblem branch is
 * kept rather than stripped out: it is a handful of lines, it is the reason the
 * three rows are the same height whether or not a mark is present, and the
 * decision it serves is the client's to revisit.
 *
 * ---
 *
 * WHAT THE EMBLEM BRANCH IS FOR, IF IT IS USED AGAIN.
 *
 * This band is ink-800. Official marks — FSSAI's in particular — are full
 * colour and drawn for white, and the usage rules attached to them generally
 * forbid recolouring, so knocking one back to a monochrome that suits a dark
 * band is not available. The tile gives the mark the white ground it is
 * specified for and the clear space around it that those rules ask for, and it
 * reads as a licence plate rather than as a logo floating on a photograph.
 *
 * It is pure white rather than the cream-50 the rest of the site would reach
 * for, because these files typically carry an opaque white background of their
 * own and a cream tile would frame it in a visible lighter rectangle. The tile
 * matches the asset, not the palette.
 *
 * `object-contain` inside a fixed box means one emblem being square and the
 * next being wide cannot change the row height, which is the usual way a pair
 * of third-party logos wrecks a layout. The box is sized in CSS rather than by
 * intrinsic attributes for the same reason — whatever dimensions the supplied
 * files happen to have, the row does not move.
 *
 * Plain <img> rather than next/image, for the reason spelled out in <Logo>:
 * `dangerouslyAllowSVG` is off on purpose, so an SVG cannot go through the
 * image pipeline — and an official emblem is far more likely to arrive as an
 * SVG than anything else on this site. This way either format works on drop-in
 * without a config change.
 */
export const Compliance = () => (
  <section className="relative overflow-hidden bg-ink-800 py-[var(--spacing-section)]">
    <div className="grain absolute inset-0" aria-hidden="true" />

    <div className="container-x relative">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Licences & compliance"
            tone="dark"
            title="Export-ready credentials"
            accentWords={["credentials"]}
            description="Operating with the required Indian regulatory and export credentials for our business activities. Documentation references are shared directly with buyers on enquiry."
          />
        </div>

        <StaggerGroup as="ul" className="lg:col-span-7 lg:pt-4">
          {company.compliance.map((item) => (
            <StaggerItem
              as="li"
              key={item.code}
              y={16}
              className="flex flex-col gap-4 border-t border-cream-100/12 py-7 sm:flex-row sm:gap-10 last:border-b"
            >
              {item.logo ? (
                <span className="flex h-16 w-28 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-white p-2.5 sm:mt-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.logo}
                    alt={item.logoAlt}
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
              ) : (
                <span className="font-sans text-[0.8125rem] font-medium tracking-[0.24em] text-bronze-400 uppercase sm:w-28 sm:shrink-0 sm:pt-1.5">
                  {item.code}
                </span>
              )}
              <div>
                <h3 className="font-display text-2xl text-cream-100">{item.title}</h3>
                <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-muted-dark">
                  {item.description}
                </p>
                {item.reference ? (
                  <p className="mt-3 text-[0.8125rem] tracking-[0.16em] text-bronze-300 uppercase">
                    Reg. {item.reference}
                  </p>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </div>
  </section>
);
