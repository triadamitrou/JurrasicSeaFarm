"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type ReactNode } from "react";

/**
 * The contact page as a stretch of the harbour, said with pictures
 * rather than puns: light falling through the surface, their own
 * watercolour fish crossing the water, kelp swaying from the floor and
 * bubbles climbing past.
 *
 * It answers back. Every keystroke in the form lets a bubble go from
 * the field being typed in, and a click anywhere in the water releases
 * a little burst.
 */

// Fixed rather than random, so the server and the browser draw the
// same water and nothing jumps on hydration.
const AMBIENT = [
  { left: 4, size: 10, dur: 11, delay: 0, wob: 10 },
  { left: 11, size: 18, dur: 14, delay: 3, wob: -14 },
  { left: 19, size: 8, dur: 9, delay: 6, wob: 8 },
  { left: 27, size: 14, dur: 12, delay: 1.5, wob: -10 },
  { left: 36, size: 6, dur: 8, delay: 4.5, wob: 12 },
  { left: 47, size: 12, dur: 13, delay: 8, wob: -12 },
  { left: 56, size: 9, dur: 10, delay: 2, wob: 9 },
  { left: 64, size: 20, dur: 16, delay: 5, wob: -16 },
  { left: 72, size: 7, dur: 9, delay: 7.5, wob: 10 },
  { left: 81, size: 15, dur: 12, delay: 0.8, wob: -9 },
  { left: 89, size: 10, dur: 11, delay: 3.8, wob: 14 },
  { left: 95, size: 13, dur: 14, delay: 6.5, wob: -11 },
];

type Pop = { id: number; x: number; y: number; size: number; wob: number };

export default function ContactScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pops, setPops] = useState<Pop[]>([]);
  const next = useRef(0);

  const release = useCallback((x: number, y: number, count: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const born: Pop[] = Array.from({ length: count }, (_, i) => ({
      id: next.current++,
      x: x + (i ? (Math.random() - 0.5) * 40 : 0),
      y: y + (i ? Math.random() * 16 : 0),
      size: 6 + Math.random() * (count > 1 ? 14 : 8),
      wob: (Math.random() - 0.5) * 30,
    }));
    setPops((p) => [...p.slice(-40), ...born]);
    const ids = new Set(born.map((b) => b.id));
    window.setTimeout(() => setPops((p) => p.filter((b) => !ids.has(b.id))), 2700);
  }, []);

  const local = (clientX: number, clientY: number) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };

  return (
    <div
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, var(--color-aqua) 0, #7fd6cc 30%, var(--color-teal) 68%, var(--color-teal-deep) 100%)",
      }}
      onInput={(e) => {
        const el = e.target as HTMLElement;
        const r = el.getBoundingClientRect();
        const { x, y } = local(r.left + Math.min(r.width - 12, 24 + Math.random() * r.width * 0.8), r.top + 8);
        release(x, y, 1);
      }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("form, a, button, input, textarea, label")) return;
        const { x, y } = local(e.clientX, e.clientY);
        release(x, y, 7);
      }}
    >
      {/* Light falling through it. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <span className="u-ray left-[12%] w-[7vw]" style={{ ["--dur" as string]: "10s" }} />
        <span className="u-ray left-[38%] w-[4vw]" style={{ ["--dur" as string]: "13s" }} />
        <span className="u-ray left-[63%] w-[9vw]" style={{ ["--dur" as string]: "11s" }} />
        <span className="u-ray left-[85%] w-[5vw]" style={{ ["--dur" as string]: "15s" }} />
      </div>

      {/* Fish, theirs, crossing at different depths and speeds. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="u-fish top-[24%] w-[11rem] sm:w-[15rem]" style={{ ["--dur" as string]: "42s" }}>
          <Image src="/img/wc-fish.webp" alt="" width={1000} height={715} />
        </div>
        <div
          className="u-fish u-fish--right top-[58%] w-[6rem] opacity-80 sm:w-[8rem]"
          style={{ ["--dur" as string]: "30s", ["--delay" as string]: "-12s" }}
        >
          <Image src="/img/wc-fish.webp" alt="" width={1000} height={715} />
        </div>
        <div
          className="u-fish top-[74%] w-[4rem] opacity-60 blur-[1px] sm:w-[5rem]"
          style={{ ["--dur" as string]: "55s", ["--delay" as string]: "-30s" }}
        >
          <Image src="/img/wc-fish.webp" alt="" width={1000} height={715} />
        </div>
      </div>

      {/* Kelp from the harbour floor, and the oysters among it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46vh]">
        <Image src="/img/wc-kelp.webp" alt="" width={800} height={1000} className="u-sway absolute -left-8 bottom-12 w-[11rem] sm:w-[17rem]" style={{ ["--dur" as string]: "8s" }} />
        <Image src="/img/wc-kelp.webp" alt="" width={800} height={1000} className="u-sway absolute left-[18%] bottom-10 hidden w-[9rem] opacity-70 md:block" style={{ ["--dur" as string]: "6.5s", ["--delay" as string]: "-2s" }} />
        <Image src="/img/wc-kelp-fish.webp" alt="" width={800} height={1000} className="u-sway absolute -right-10 bottom-12 w-[12rem] sm:w-[19rem]" style={{ ["--dur" as string]: "9s", ["--delay" as string]: "-4s" }} />
        <Image src="/img/wc-oysters.webp" alt="" width={876} height={881} className="absolute bottom-16 left-[30%] hidden w-[8rem] rotate-[-8deg] md:block" />
      </div>

      {/* Ambient bubbles. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {AMBIENT.map((b, i) => (
          <span
            key={i}
            className="u-bubble"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              ["--dur" as string]: `${b.dur}s`,
              ["--delay" as string]: `${-b.delay}s`,
              ["--wob" as string]: `${b.wob}px`,
            }}
          />
        ))}
      </div>

      {/* Bubbles somebody made. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        {pops.map((b) => (
          <span
            key={b.id}
            className="u-bubble u-bubble--pop"
            style={{ left: b.x, top: b.y, width: b.size, height: b.size, ["--wob" as string]: `${b.wob}px` }}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
