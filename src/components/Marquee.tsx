"use client";

import { useEffect, useRef } from "react";

/**
 * A band that drifts like a line of floats on the swell: it runs on its
 * own, surges when the page moves, and turns with the tide when you
 * scroll back up. Driven from a rAF loop writing a transform.
 */
export default function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let dir = 1;
    let boost = 0;
    let lastY = window.scrollY;
    let frame = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      boost += (Math.min(Math.abs(dy), 80) - boost) * 0.08;
      if (visible) {
        const half = el.scrollWidth / 2;
        x -= dir * (0.45 + boost * 0.12);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);

  const run = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`} aria-label={items.join(", ")} role="marquee">
      <div ref={track} className="u-marquee-track" aria-hidden="true">
        {[0, 1].map((copy) =>
          run.map((item, i) => (
            <span key={`${copy}-${i}`} className="flex items-center whitespace-nowrap">
              <span className="u-display px-6 text-[clamp(1.4rem,3vw,2.4rem)] italic">{item}</span>
              <span className="u-mark w-6 opacity-70" />
            </span>
          )),
        )}
      </div>
    </div>
  );
}
