"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mailto, nav } from "@/lib/site";

/**
 * Sits over the photograph until you leave it, then takes the deep
 * harbour as its ground. The condensed state is written from a rAF loop
 * straight to the DOM rather than through state.
 */
export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let last: boolean | null = null;
    const tick = () => {
      const condensed = window.scrollY > 40;
      if (condensed !== last) {
        el.dataset.condensed = String(condensed);
        last = condensed;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isHere = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <header
      ref={ref}
      data-condensed="false"
      data-open={open}
      className="site-header fixed inset-x-0 top-0 z-50 py-3 text-foam"
    >
      <div className="u-wrap flex items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Jurassic Sea Farms - home"
          onClick={() => setOpen(false)}
          className="relative z-10 shrink-0"
        >
          <span className="u-logo w-[8.5rem] sm:w-[10rem]" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isHere(item.href) ? "page" : undefined}
              className="group relative py-1 text-[0.86rem] font-medium"
            >
              {item.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left bg-kelp transition-transform duration-500 group-hover:scale-x-100 ${isHere(item.href) ? "scale-x-100" : "scale-x-0"}`}
                style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={mailto("Oyster Enquiry")} className="u-btn hidden py-2.5 sm:inline-flex">
            Buy oysters
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden"
          >
            <span
              className={`block h-[1.5px] w-6 bg-current transition-transform duration-500 ${open ? "translate-y-[3.75px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[1.5px] w-6 bg-current transition-transform duration-500 ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={[
          "fixed inset-0 -z-10 bg-navy transition-[clip-path] duration-700 lg:hidden",
          open ? "[clip-path:circle(150%_at_100%_0)]" : "[clip-path:circle(0%_at_100%_0)]",
        ].join(" ")}
        style={{ transitionTimingFunction: "var(--ease-in-out-quart)" }}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile" className="u-wrap flex h-full flex-col justify-center gap-1 pb-16">
          {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="u-display border-b border-foam/15 py-3.5 text-[10vw] sm:text-[7vw]"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(1rem)",
                transition: `opacity 650ms var(--ease-out-expo) ${120 + i * 55}ms, transform 650ms var(--ease-out-expo) ${120 + i * 55}ms`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={mailto("Oyster Enquiry")}
            onClick={() => setOpen(false)}
            className="u-btn mt-8 self-start"
            style={{ opacity: open ? 1 : 0, transition: "opacity 650ms var(--ease-out-expo) 420ms" }}
          >
            Buy our oysters
          </a>
        </nav>
      </div>
    </header>
  );
}
