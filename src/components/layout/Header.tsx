"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LazyMotion, domMax, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight } from "@/components/ui/icons";
import { mainNav, site } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Only one boolean is derived from scrolling, and React skips renders when it
  // does not change. The bar never moves, so there is nothing to jitter.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);

  // Close the menu after navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Scroll lock, Escape and a simple focus trap while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const first = dialog.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("a, button"));
      const head = focusable[0];
      const tail = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === head) {
        event.preventDefault();
        tail?.focus();
      } else if (!event.shiftKey && document.activeElement === tail) {
        event.preventDefault();
        head?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <LazyMotion features={domMax} strict>
      <a
        href="#continut"
        className="type-label sr-only bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[80]"
      >
        Sari la conținut
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 sm:px-[var(--gutter)] lg:top-4">
        <div
          className={`pointer-events-auto relative mx-auto flex h-14 max-w-[68rem] items-center justify-between gap-6 rounded-full border bg-paper pl-5 pr-1.5 transition-[border-color,box-shadow] duration-300 lg:pl-7 lg:pr-2 ${
            scrolled ? "border-line shadow-[0_10px_30px_-18px_rgba(17,17,16,0.35)]" : "border-line"
          }`}
        >
          <Link href="/" aria-label="ImpactoMedia, pagina principală" className="shrink-0">
            <Logo preload className="w-[128px] md:w-[150px] lg:w-[150px]" />
          </Link>

          <nav aria-label="Navigare principală" className="absolute left-1/2 hidden -translate-x-1/2 lg:block" onMouseLeave={() => setHovered(null)}>
            <ul className="flex items-center gap-1">
              {[{ label: "Acasă", href: "/" }, ...mainNav.slice(0, -1)].map((item) => {
                const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
                const lit = hovered ? hovered === item.href : active;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={() => setHovered(item.href)}
                      onFocus={() => setHovered(item.href)}
                      onBlur={() => setHovered(null)}
                      className="relative flex h-10 items-center rounded-full px-5 text-[0.9375rem] font-medium"
                    >
                      {lit ? (
                        <m.span
                          layoutId="nav-lamp"
                          aria-hidden="true"
                          className="absolute inset-0 -z-0 rounded-full bg-paper-deep"
                          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                        >
                          <span className="absolute -top-2 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-b-full bg-signal" />
                        </m.span>
                      ) : null}
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/contact"
            aria-current={isActive(pathname, "/contact") ? "page" : undefined}
            className="group hidden h-10 items-center gap-3 rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-paper transition-colors duration-200 hover:bg-signal aria-[current=page]:bg-signal lg:inline-flex"
          >
            Contact
            <ArrowRight className="arrow-nudge arrow-nudge-right text-sm" />
          </Link>

          <button
            ref={menuButton}
            type="button"
            className="group flex h-11 items-center gap-3 rounded-full bg-ink pl-5 pr-4 text-[0.9375rem] font-medium text-paper transition-colors duration-200 hover:bg-signal lg:hidden"
            aria-expanded={open}
            aria-controls="meniu-mobil"
            onClick={() => setOpen(true)}
          >
            Meniu
            <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
              <span className="h-px w-full bg-paper" />
              <span className="h-px w-2/3 self-end bg-paper transition-[width] duration-300 group-hover:w-full" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <m.div
            ref={dialog}
            id="meniu-mobil"
            role="dialog"
            aria-modal="true"
            aria-label="Meniu"
            className="fixed inset-0 z-[70] flex flex-col bg-ink text-paper lg:hidden"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduceMotion ? 0.15 : 0.6, ease }}
          >
            <div className="mx-3 mt-3 flex h-14 items-center justify-between rounded-full border border-line-dark pl-5 pr-1.5 sm:mx-[var(--gutter)]">
              <Link href="/" aria-label="ImpactoMedia, pagina principală" onClick={() => setOpen(false)}>
                <Logo tone="dark" className="w-[128px] md:w-[150px]" />
              </Link>
              <button
                type="button"
                onClick={close}
                className="flex h-11 items-center gap-3 rounded-full bg-paper pl-5 pr-4 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:bg-signal hover:text-paper"
              >
                Închide
                <span aria-hidden="true" className="relative block h-4 w-4">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <nav aria-label="Navigare mobilă" className="shell flex flex-1 flex-col justify-center">
              <ul className="space-y-1">
                {[{ label: "Acasă", href: "/" }, ...mainNav].map((item, index) => (
                  <m.li
                    key={item.href}
                    className=""
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: reduceMotion ? 0 : 0.18 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href || (item.href !== "/" && isActive(pathname, item.href)) ? "page" : undefined}
                      className="group relative flex items-baseline justify-between rounded-full px-5 py-3 type-h2 transition-colors duration-200 hover:bg-line-dark/60 aria-[current=page]:bg-line-dark"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 hidden h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-signal group-aria-[current=page]:block"
                      />
                      {item.label}
                      <span className="type-label text-ash">{String(index).padStart(2, "0")}</span>
                    </Link>
                  </m.li>
                ))}
              </ul>
            </nav>

            <m.div
              className="shell grid gap-1 pb-8 pt-6 text-[0.9375rem] text-ash"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.45 }}
            >
              <a href={site.phone.href} className="text-lg text-paper">
                {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`} className="text-lg text-paper">
                {site.email}
              </a>
              <p>
                {site.city}, {site.country}
              </p>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
