import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import type { Specification } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductSpecificationProps = {
  specifications: Specification[];
  tone?: "dark" | "light";
  columns?: 1 | 2;
  className?: string;
  /** Shows the "indicative values" note beneath the table */
  showNote?: boolean;
};

/**
 * Specification table. Values come from data/products.ts — never from the UI —
 * so the catalogue can be updated without touching a component.
 */
export const ProductSpecification = ({
  specifications,
  tone = "light",
  columns = 1,
  className,
  showNote = true,
}: ProductSpecificationProps) => (
  <div className={className}>
    <StaggerGroup
      as="dl"
      step={0.07}
      className={cn(
        "border-t",
        tone === "dark" ? "border-cream-100/12" : "border-ink-900/12",
        columns === 2 && "sm:grid sm:grid-cols-2 sm:gap-x-10",
      )}
    >
      {specifications.map((spec) => (
        <StaggerItem key={spec.label} y={14}>
          <div
            className={cn(
              "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-3.5",
              tone === "dark" ? "border-cream-100/12" : "border-ink-900/12",
            )}
          >
            <dt
              className={cn(
                "text-[0.6875rem] tracking-[0.22em] uppercase",
                tone === "dark" ? "text-bronze-300" : "text-bronze-700",
              )}
            >
              {spec.label}
            </dt>
            <dd
              className={cn(
                "text-[0.9375rem] sm:text-right",
                tone === "dark" ? "text-cream-100" : "text-ink-800",
              )}
            >
              {spec.value}
            </dd>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>

    {showNote ? (
      <p
        className={cn(
          "mt-5 text-xs leading-relaxed",
          tone === "dark" ? "text-muted-dark" : "text-muted-light",
        )}
      >
        Values are indicative of standard Indian trade grades. Exact figures are
        confirmed per lot and stated in the contract and pre-shipment documents.
      </p>
    ) : null}
  </div>
);
