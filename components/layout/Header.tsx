"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { navigation } from "@/data/company";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * Sticky header, in two states: nothing at all over the hero, then a near-solid
 * bar once the page scrolls, losing a little height as it goes.
 *
 * Three links and one CTA. The product dropdown was removed — the products
 * index is one click away and the hover menu was the only piece of state in
 * the header that could trap keyboard focus.
 *
 * The bar's bottom edge carries the global scroll progress indicator, which is
 * the only piece of chrome on the site that reports position. See the note at
 * the bottom of the header for why it lives there rather than on the page.
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
          /*
            Two states, and the scrolled one is a bar rather than a pane of
            glass.

            It used to be `bg-ink-950/85` behind `backdrop-blur-xl` — a 24px
            blur under a 15%-transparent ground, which is the glassmorphism the
            brief rules out and, more to the point, is not reliably readable:
            the nav sits over the whole page, and at 85% a bright frame (the
            grading tray, the container door) still lifts the ground far enough
            to pull the inactive links under 4.5:1.

            92% with a 4px blur is the other trade. The bar is now a bar — the
            blur is there to stop hard edges of a photograph reading through it,
            not to be the effect — and the ground barely moves whatever passes
            underneath, so the link contrast measured on the darkest band holds
            on the brightest one too.
          */
          scrolled || menuOpen
            ? "border-b border-cream-100/10 bg-ink-950/92 py-3 backdrop-blur-sm"
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
        {/*
          The global progress indicator, sitting on the header's own bottom
          edge.

          This is the least dominant place it can live and still be legible: it
          is one device pixel, it is the bronze the rules and eyebrows already
          use, and it occupies the line the border occupies rather than adding a
          second horizontal element to the top of the page. Over the hero the
          header has no border and the bar has no width yet, so the opening
          screen is untouched — the indicator only appears once there is
          progress to report.

          It reads the document rather than a section, so it answers "how far
          through the whole story am I" rather than "how far through this band".
          That is the question the brief asks it to answer, and it is why it is
          mounted in the layout rather than on the homepage.
        */}
        <ScrollProgress className="absolute inset-x-0 bottom-[-1px]" />
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
