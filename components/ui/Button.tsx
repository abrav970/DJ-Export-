import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "ghostDark" | "light";
type Size = "md" | "lg";

/**
 * Filled control carrying a contrasting hairline border and a trailing arrow
 * that sits inside the button rather than after it — hence the asymmetric
 * padding, which reserves the trailing space the arrow moves into on hover.
 */
const base =
  "group relative inline-flex items-center justify-between gap-6 rounded-[var(--radius-control)] font-medium tracking-wide transition-[background-color,color,border-color,transform] duration-500 ease-[var(--ease-premium)] disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<Size, string> = {
  md: "py-3 ps-5 pe-4 text-[0.8125rem]",
  lg: "py-4 ps-7 pe-5 text-sm",
};

/** Applied only when the button has no trailing arrow to balance. */
const evenPadding: Record<Size, string> = {
  md: "px-6 justify-center gap-2.5",
  lg: "px-8 justify-center gap-2.5",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-bronze-500 text-ink-950 border-[1.5px] border-bronze-200/70 hover:bg-bronze-400 hover:border-cream-50 active:translate-y-px",
  outline:
    "border-[1.5px] border-bronze-500/45 text-bronze-200 hover:border-bronze-300 hover:bg-bronze-500/10",
  light:
    "border-[1.5px] border-ink-900/20 text-ink-900 hover:border-ink-900/45 hover:bg-ink-900/5",
  ghost: "text-ink-900 hover:text-bronze-700",
  /* Quiet secondary on dark: the primary control should not have a rival. */
  ghostDark: "text-cream-200 hover:text-bronze-300",
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
  <button
    className={cn(
      base,
      withArrow ? sizes[size] : evenPadding[size],
      variants[variant],
      className,
    )}
    {...props}
  >
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
  <Link
    href={href}
    className={cn(
      base,
      withArrow ? sizes[size] : evenPadding[size],
      variants[variant],
      className,
    )}
    {...props}
  >
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
