"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { column } from "@/lib/site";

/**
 * The descent. The farm is a stack: oyster bags at the surface, kelp on
 * ropes beneath, and what drifts down from one feeds the other. As the
 * section scrolls, the water behind it deepens from the aqua of the
 * surface to the dark of the harbour, a float sinks down the gauge, and
 * each layer of the farm surfaces in turn.
 *
 * Progress is written to a CSS variable from one rAF loop; nothing here
 * re-renders.
 */
export default function WaterColumn() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
    let frame = 0;
    let last = -1;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      if (Math.abs(p - last) > 0.001) {
        el.style.setProperty("--p", p.toFixed(4));
        const active = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
        steps.forEach((s, i) => (s.dataset.on = String(i === active)));
        last = p;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="column-title"
      className="relative"
      style={{ height: `${column.length * 85 + 40}vh`, ["--p" as string]: 0 }}
    >
      <div
        className="sticky top-0 flex h-[100svh] items-center overflow-hidden"
        style={{
          background:
            "color-mix(in oklab, color-mix(in oklab, var(--color-aqua), var(--color-teal) calc(min(var(--p) * 2, 1) * 100%)), var(--color-abyss) calc(max(var(--p) * 2 - 1, 0) * 100%))",
        }}
      >
        {/* Light from the surface, fading as the float goes down. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.45), transparent)",
            opacity: "calc(1 - var(--p) * 1.4)",
          }}
        />
        <Image
          src="/img/wc-kelp.webp"
          alt=""
          width={800}
          height={1000}
          className="pointer-events-none absolute -bottom-10 right-[-4rem] w-[16rem] opacity-60 sm:w-[24rem] lg:right-[4%]"
          style={{ transform: "translate3d(0, calc((1 - var(--p)) * 30vh), 0)" }}
        />

        <div className="u-wrap relative grid w-full gap-10 lg:grid-cols-[minmax(0,5fr)_auto_minmax(0,6fr)] lg:gap-16">
          <div
            className="transition-colors duration-700"
            style={{ color: "color-mix(in oklab, var(--color-navy), var(--color-foam) calc(min(var(--p) * 2.4, 1) * 100%))" }}
          >
            <p className="u-label opacity-80">Why aquaculture?</p>
            <h2 id="column-title" className="u-display mt-4 text-[clamp(2.2rem,5vw,4.4rem)]">
              Side by side, each nurturing the other.
            </h2>
            <p className="u-body mt-6 max-w-[42ch] opacity-90">
              On our Portland Harbour site, we cultivate Sugar Kelp and Pacific Oysters side by side,
              each nurturing and promoting the growth of the other in harmony.
            </p>
          </div>

          {/* The gauge: a line from surface to depth with a float sinking down it. */}
          <div aria-hidden="true" className="relative hidden w-px self-stretch bg-current/30 text-foam lg:block">
            <span
              className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-foam bg-coral"
              style={{ top: "calc(var(--p) * (100% - 1rem))" }}
            />
          </div>

          <ol className="relative min-h-[16rem] sm:min-h-[14rem]">
            {column.map((c, i) => (
              <li
                key={c.depth}
                data-step
                data-on={i === 0}
                className="absolute inset-0 transition-all duration-700 data-[on=false]:pointer-events-none data-[on=false]:translate-y-6 data-[on=false]:opacity-0"
                style={{
                  transitionTimingFunction: "var(--ease-out-expo)",
                  color: "color-mix(in oklab, var(--color-navy), var(--color-foam) calc(min(var(--p) * 2.4, 1) * 100%))",
                }}
              >
                <p className="u-label flex items-center gap-3">
                  <span className="tabular-nums opacity-60">0{i + 1}</span>
                  {c.depth}
                </p>
                <h3 className="u-display u-feature mt-3 text-[clamp(2.6rem,7vw,5.6rem)]">{c.title}</h3>
                <p className="u-body mt-4 max-w-[40ch]">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
