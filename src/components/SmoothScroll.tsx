"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const HEADER_CLEARANCE = 96;

/** Absolute scroll position that puts `el` just below the fixed header. */
function destinationOf(el: Element) {
  return el.getBoundingClientRect().top + window.scrollY - HEADER_CLEARANCE;
}

/**
 * Inertial scrolling. The long tail on the lerp is what makes section
 * transitions read as one continuous move rather than a series of jumps.
 *
 * It also owns every programmatic scroll on the site - anchors, deep links
 * like /team#chloe-buckley, and the reset on navigation - so all of them
 * ride the same easing instead of jumping.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis holds its own scroll position, so the browser's restoration would
  // fight it and drop you mid-page on a fresh navigation.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href*="#"]',
      );
      if (!link || link.target === "_blank" || e.metaKey || e.ctrlKey) return;

      const url = new URL(link.href, window.location.href);
      // Only intercept links that land on this same page.
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      e.preventDefault();
      history.pushState(null, "", url.hash);
      lenis.scrollTo(destinationOf(target), { duration: 1.5 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // On navigation: land on the anchor if the URL names one, otherwise reset
  // to the top. The element may not be laid out for a frame or two after a
  // route change, so poll briefly rather than assume it is there.
  useEffect(() => {
    const hash = window.location.hash;
    const lenis = lenisRef.current;

    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      return;
    }

    let tries = 0;
    let frame = 0;
    const find = () => {
      const target = document.querySelector(hash);
      if (target) {
        const top = destinationOf(target);
        if (lenis) {
          // After a route change Lenis still holds the previous page's height
          // and position. Re-measure and snap it to where the browser really
          // is before animating, or it overshoots by the old offset.
          lenis.resize();
          lenis.scrollTo(window.scrollY, { immediate: true, force: true });
          lenis.scrollTo(top, { duration: 1.5, force: true });
        } else {
          window.scrollTo(0, top);
        }
        return;
      }
      if (tries++ < 30) frame = requestAnimationFrame(find);
    };
    frame = requestAnimationFrame(find);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
