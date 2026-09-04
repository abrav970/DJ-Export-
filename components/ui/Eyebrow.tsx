import { cn } from "@/lib/utils";

/** Standalone eyebrow label, used where a full SectionHeading is too much. */
export const Eyebrow = ({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) => (
  <div className={cn("flex items-center gap-4", className)}>
    <span className="h-px w-8 bg-bronze-500/60" />
    <span className={cn("eyebrow", tone === "dark" ? "text-bronze-300" : "text-bronze-700")}>
      {children}
    </span>
  </div>
);
