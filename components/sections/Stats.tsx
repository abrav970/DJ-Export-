import { Counter } from "@/components/motion/Counter";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { company } from "@/data/company";

/**
 * Statistics band. Figures live in data/company.ts and describe the catalogue
 * and our service commitment — nothing here is a claim about trade volumes.
 */
export const Stats = () => (
  <section className="relative overflow-hidden bg-ink-950 py-20 lg:py-24">
    <div className="grain absolute inset-0" aria-hidden="true" />

    <div className="container-x relative">
      <StaggerGroup
        as="dl"
        step={0.12}
        className="grid gap-px bg-cream-100/10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {company.stats.map((stat) => (
          <StaggerItem
            key={stat.label}
            className="flex flex-col bg-ink-950 px-2 py-8 text-center lg:py-10"
          >
            {/* dt precedes dd in the DOM for semantics; order swaps them visually */}
            <dt className="order-2 mx-auto mt-4 max-w-[15rem] text-[0.8125rem] leading-relaxed text-cream-100/85">
              {stat.label}
            </dt>
            <dd className="order-1 font-display text-[3.5rem] leading-none text-bronze-400 lg:text-[4.25rem]">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
            <p className="order-3 mx-auto mt-2 max-w-[15rem] text-xs leading-relaxed text-cream-200/45">
              {stat.note}
            </p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  </section>
);
