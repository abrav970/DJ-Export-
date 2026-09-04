"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { company, navigation } from "@/data/company";
import { easePremium } from "@/lib/motion";
import { whatsappLink } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

export const MobileMenu = ({ open, onClose, pathname }: MobileMenuProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Escape to close, focus moved into the panel, background scroll locked.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);


  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 flex flex-col bg-ink-950/98 backdrop-blur-xl lg:hidden"
          initial={{ opacity: 0, y: reduce ? 0 : -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -12 }}
          transition={{ duration: 0.4, ease: easePremium }}
        >
          <div className="h-[var(--header-h,5rem)] shrink-0" />
          <nav className="container-x flex-1 overflow-y-auto pb-12">
            <ul className="divide-y divide-cream-100/8 border-t border-cream-100/8">
              {navigation.map((link, index) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: easePremium,
                      delay: 0.05 + index * 0.045,
                    }}
                  >
                    <Link
                      href={link.href}
                      prefetch={false}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-baseline justify-between py-4 font-display text-3xl text-cream-100 transition-colors duration-300 ${
                        active ? "text-bronze-300" : "hover:text-bronze-300"
                      }`}
                    >
                      {link.label}
                      <span className="text-[0.6rem] tracking-[0.3em] text-bronze-500/60 uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-10 space-y-4">
              <Link
                href="/contact#quote"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-[var(--radius-control)] bg-bronze-500 px-6 py-4 text-sm font-medium tracking-wide text-ink-950"
              >
                Request a Quote
              </Link>
              <div className="space-y-1 pt-4 text-sm text-muted-dark">
                <a href={`mailto:${company.contact.email}`} className="block hover:text-bronze-300">
                  {company.contact.email}
                </a>
                <a
                  href={whatsappLink(company.contact.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-bronze-300"
                >
                  WhatsApp {company.contact.whatsapp}
                </a>
              </div>
            </div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
