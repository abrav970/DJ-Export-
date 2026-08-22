import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 font-medium tracking-wide transition-[background-color,color,border-color,transform] duration-500 ease-[var(--ease-premium)] disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[0.8125rem]",
  lg: "px-8 py-4 text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-bronze-500 text-ink-950 hover:bg-bronze-400 active:translate-y-px",
  outline:
    "border border-bronze-500/45 text-bronze-200 hover:border-bronze-400 hover:bg-bronze-500/10",
  light:
    "border border-ink-900/20 text-ink-900 hover:border-ink-900/45 hover:bg-ink-900/5",
  ghost: "text-ink-900 hover:text-bronze-600",
};

const Arrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className="transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1"
  >
    <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type ButtonContentProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  ...props
}: ButtonContentProps & ComponentProps<"button">) => (
  <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
    {children}
    {withArrow ? <Arrow /> : null}
  </button>
);

export const ButtonLink = ({
  children,
  href,
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  ...props
}: ButtonContentProps & ComponentProps<typeof Link>) => (
  <Link href={href} className={cn(base, sizes[size], variants[variant], className)} {...props}>
    {children}
    {withArrow ? <Arrow /> : null}
  </Link>
);

/** Understated inline link with a rule that draws in on hover. */
export const TextLink = ({
  children,
  href,
  className,
  ...props
}: { children: ReactNode; className?: string } & ComponentProps<typeof Link>) => (
  <Link
    href={href}
    className={cn(
      "group inline-flex items-center gap-2 text-[0.8125rem] font-medium tracking-[0.12em] uppercase",
      className,
    )}
    {...props}
  >
    <span className="relative">
      {children}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-x-100" />
    </span>
    <Arrow />
  </Link>
);
