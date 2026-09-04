"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/data/company";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * Sticky header. Transparent over the hero, then a dark glass bar once the page
 * scrolls, losing a little height as it goes.
 *
 * Three links and one CTA. The product dropdown was removed — the products
 * index is one click away and the hover menu was the only piece of state in
 * the header that could trap keyboard focus.
 */
export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Close the menu when the route changes, adjusted during render rather than
  // in an effect so there is no flash of the previous state.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <motion.header
        /*
          data-reveal, because the bar starts at opacity 0. Without it a reader
          who asks for reduced motion gets a header that never finishes
          arriving — the same failure the reveal primitives are tagged against.
        */
        data-reveal
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ease-[var(--ease-premium)]",
          scrolled || menuOpen
            ? "border-b border-cream-100/8 bg-ink-950/85 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-5",
        )}
        style={{ ["--header-h" as string]: "5rem" }}
        /*
          The bar settles in with the hero rather than being there before it.
          It sits in the root layout, so this runs once per full page load and
          not on client navigations.
        */
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easePremium, delay: 0.15 }}
      >
        <div className="container-x flex items-center justify-between gap-8">
          <Logo showTagline={!scrolled} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navigation.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.href}>
                    <NavLink href={item.href} active={active}>
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact#quote"
              className="hidden rounded-[var(--radius-control)] bg-bronze-500 px-6 py-3 text-[0.8125rem] font-medium tracking-wide text-ink-950 transition-colors duration-500 hover:bg-bronze-400 lg:inline-flex"
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
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    className={cn(
      "group relative inline-flex items-center text-[0.8125rem] tracking-[0.14em] uppercase transition-colors duration-500",
      active ? "text-bronze-300" : "text-cream-100/85 hover:text-bronze-200",
    )}
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
