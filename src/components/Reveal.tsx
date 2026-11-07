"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Mode = "rise" | "fade" | "words" | "port" | "draw";

/**
 * One observer for the whole document: elements opt in with [data-reveal]
 * and are unobserved once played, so nothing re-animates on the way back up.
 */
function useRevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}

export function RevealProvider() {
  useRevealObserver();
  return null;
}

export function Reveal({
  as: Tag = "div",
  mode = "rise",
  delay = 0,
  className = "",
  children,
}: {
  as?: ElementType;
  mode?: Mode;
  delay?: number;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Tag
      data-reveal={mode}
      className={className}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Splits a phrase into words, each in its own clipping box, so they climb
 * into view one after another. Words rather than characters keeps it
 * feeling typeset instead of mechanical.
 */
export function Words({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 42,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <Tag data-reveal="words" className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="word"
          style={{ "--d": `${delay + i * stagger}ms` } as React.CSSProperties}
        >
          <span>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Translates its children against the scroll at a fraction of page speed. */
export function Parallax({
  speed = 0.1,
  className = "",
  children,
}: {
  speed?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = () => {
      if (visible) {
        const rect = el.getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(2)}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
