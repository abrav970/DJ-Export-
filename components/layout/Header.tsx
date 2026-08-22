"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/data/company";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * Sticky header. Transparent over the hero, then transitions to a dark glass
 * bar once the page scrolls. The mark and navigation always sit on a dark
 * surface, matching the logo artwork.
 */
export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Close any open menu when the route changes, adjusted during render rather
  // than in an effect so there is no flash of the previous state.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setProductsOpen(false);
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ease-[var(--ease-premium)]",
          scrolled || menuOpen
            ? "border-b border-cream-100/8 bg-ink-950/85 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-6",
        )}
        style={{ ["--header-h" as string]: "5.5rem" }}
      >
        <div className="container-x flex items-center justify-between gap-8">
          <Logo showTagline={!scrolled} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navigation.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <NavLink href={item.href} active={active}>
                        {item.label}
                      </NavLink>
                    </li>
                  );
                }

                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                    onFocus={() => setProductsOpen(true)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                        setProductsOpen(false);
                      }
                    }}
                  >
                    <NavLink
                      href={item.href}
                      active={active}
                      aria-expanded={productsOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <svg
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                        aria-hidden="true"
                        className={cn(
                          "ml-1.5 inline-block transition-transform duration-300",
                          productsOpen && "rotate-180",
                        )}
                      >
                        <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </NavLink>

                    <div
                      className={cn(
                        "absolute top-full left-1/2 w-60 -translate-x-1/2 pt-5 transition-[opacity,transform] duration-300 ease-[var(--ease-premium)]",
                        productsOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1.5 opacity-0",
                      )}
                    >
                      <ul className="border border-cream-100/10 bg-ink-900/97 p-2 shadow-[var(--shadow-panel)] backdrop-blur-xl">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              prefetch={false}
                              tabIndex={productsOpen ? 0 : -1}
                              className={cn(
                                "block px-4 py-3 text-sm text-cream-200/80 transition-colors duration-300 hover:bg-bronze-500/10 hover:text-bronze-200",
                                pathname === child.href && "text-bronze-300",
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact#quote"
              className="hidden bg-bronze-500 px-6 py-3 text-[0.8125rem] font-medium tracking-wide text-ink-950 transition-colors duration-500 hover:bg-bronze-400 lg:inline-flex"
            >
              Request a Quote
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative z-50 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3.5 w-6">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-cream-100 transition-transform duration-400 ease-[var(--ease-premium)]",
                    menuOpen ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px bg-cream-100 transition-all duration-400 ease-[var(--ease-premium)]",
                    menuOpen ? "top-1.5 w-full -rotate-45" : "top-3 w-2/3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
};

const NavLink = ({
  href,
  active,
  children,
  ...props
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
} & React.ComponentProps<typeof Link>) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    className={cn(
      "group relative inline-flex items-center text-[0.8125rem] tracking-[0.14em] uppercase transition-colors duration-500",
      active ? "text-bronze-300" : "text-cream-100/85 hover:text-bronze-200",
    )}
    {...props}
  >
    {children}
    <span
      className={cn(
        "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-bronze-400 transition-transform duration-500 ease-[var(--ease-premium)]",
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
      )}
    />
  </Link>
);
