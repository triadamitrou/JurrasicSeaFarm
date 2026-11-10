"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { shop } from "@/lib/site";

/**
 * Click and collect, laid out like a good fishmonger's counter: a large
 * photograph, a name, one line, and a row per pack with an Add button.
 * Nothing else competes. Collection only, so every price reads
 * "collected", never delivered.
 *
 * It is a preview: no order is sent and nothing is charged. Prices stay
 * empty until the farm gives them, and the rows say so quietly.
 */

type Key = string; // `${item}:${pack}`

const gbp = (n: number) => `£${Number.isInteger(n) ? n : n.toFixed(2)}`;
const noop = () => () => {};

/** The next seven days from tomorrow, read in the browser only. */
function useDays() {
  const client = useSyncExternalStore(noop, () => true, () => false);
  return useMemo(() => {
    if (!client) return [];
    return Array.from({ length: 7 }, (_, n) => {
      const d = new Date();
      d.setDate(d.getDate() + n + 1);
      return {
        key: d.toISOString().slice(0, 10),
        day: d.toLocaleDateString("en-GB", { weekday: "short" }),
        date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      };
    });
  }, [client]);
}

const GOLD = "#8a6a2a";

export default function ClickCollect() {
  const [qty, setQty] = useState<Record<Key, number>>({});
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState(shop.slots[0]);
  const [placed, setPlaced] = useState<string | null>(null);
  const days = useDays();

  const set = (k: Key, n: number) => {
    setPlaced(null);
    setQty((q) => {
      const next = { ...q };
      if (n <= 0) delete next[k];
      else next[k] = n;
      return next;
    });
  };

  const lines = Object.entries(qty).map(([k, n]) => {
    const [item, pack] = k.split(":");
    const i = shop.items.find((x) => x.key === item)!;
    const p = i.packs.find((x) => x.key === pack)!;
    return { k, i, p, n };
  });
  const count = lines.reduce((s, l) => s + l.n, 0);
  const priced = lines.every((l) => l.p.price !== null);
  const total = lines.reduce((s, l) => s + (l.p.price ?? 0) * l.n, 0);
  const chosen = days.find((d) => d.key === day);

  return (
    <>
      <section aria-label="Products" className="bg-white pb-24 pt-16 text-navy sm:pt-20">
        <div className="u-wrap grid gap-x-10 gap-y-20 md:grid-cols-2">
          {shop.items.map((it, idx) => (
            <article key={it.key} className="flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-navy/[0.04]">
                <Image
                  src={it.image}
                  alt={it.alt}
                  fill
                  sizes="(min-width:768px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>

              <p className="u-label mt-8" style={{ color: GOLD }}>
                {idx === 0 ? "The harvest" : "Grown alongside"}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,3.2vw,2.75rem)] font-normal leading-tight">
                {it.name}
              </h2>
              <p className="mt-3 max-w-[46ch] text-[1.02rem] leading-relaxed text-navy/65">{it.line}</p>

              <ul className="mt-8 border-t border-navy/12">
                {it.packs.map((p) => {
                  const k = `${it.key}:${p.key}`;
                  const n = qty[k] ?? 0;
                  return (
                    <li key={p.key} className="flex items-center justify-between gap-6 border-b border-navy/12 py-5">
                      <div>
                        <p className="text-[1.05rem]">{p.label}</p>
                        <p className="mt-0.5 text-navy/55">
                          {p.price === null ? (
                            <span className="text-[0.92rem]">Price to confirm</span>
                          ) : (
                            <>
                              <span className="font-[family-name:var(--font-display)] text-[1.35rem] text-navy">
                                {gbp(p.price)}
                              </span>{" "}
                              <span className="text-[0.92rem]">collected</span>
                            </>
                          )}
                        </p>
                      </div>
                      {n === 0 ? (
                        <button
                          type="button"
                          onClick={() => set(k, 1)}
                          aria-label={`Add ${p.label} of ${it.name}`}
                          className="h-12 w-[7.5rem] border border-navy/30 text-[0.82rem] font-medium uppercase tracking-[0.22em] transition-colors hover:border-navy hover:bg-navy hover:text-white"
                        >
                          Add
                        </button>
                      ) : (
                        <div
                          role="group"
                          aria-label={`${p.label} of ${it.name} in the order`}
                          className="flex h-12 w-[7.5rem] items-stretch bg-navy text-white"
                        >
                          <button type="button" aria-label="One fewer" onClick={() => set(k, n - 1)} className="flex-1 text-lg hover:bg-white/10">
                            &minus;
                          </button>
                          <span aria-live="polite" className="grid w-8 place-items-center font-semibold tabular-nums">
                            {n}
                          </span>
                          <button type="button" aria-label="One more" onClick={() => set(k, n + 1)} className="flex-1 text-lg hover:bg-white/10">
                            +
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 text-[0.92rem] text-navy/55">
                <span className="border-b border-navy/30 pb-0.5">Collected from {shop.collectFrom}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* The order: one quiet panel, collection only. */}
      <section id="collection" aria-label="Your collection" className="scroll-mt-24 bg-white pb-32 text-navy">
        <div className="u-wrap">
          <div className="grid gap-12 border-t border-navy/15 pt-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="u-label" style={{ color: GOLD }}>
                Your collection
              </p>
              {lines.length === 0 ? (
                <p className="mt-5 text-navy/55">Nothing added yet.</p>
              ) : (
                <ul className="mt-5 border-t border-navy/12">
                  {lines.map((l) => (
                    <li key={l.k} className="flex items-baseline justify-between gap-4 border-b border-navy/12 py-4">
                      <span>
                        {l.n} &times; {l.i.name}, {l.p.label}
                      </span>
                      <span className="text-navy/60">{l.p.price === null ? "to confirm" : gbp(l.p.price * l.n)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex items-baseline justify-between">
                <span className="u-label text-navy/55">Total</span>
                <span className="font-[family-name:var(--font-display)] text-[1.8rem]">
                  {lines.length === 0 ? gbp(0) : priced ? gbp(total) : <span className="text-[1rem] text-navy/55">To confirm</span>}
                </span>
              </div>
            </div>

            <div>
              <p className="u-label text-navy/55">Collection day</p>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    aria-pressed={day === d.key}
                    onClick={() => setDay(d.key)}
                    className={`border py-2.5 text-center text-[0.85rem] leading-tight transition-colors ${day === d.key ? "border-navy bg-navy text-white" : "border-navy/25 hover:border-navy"}`}
                  >
                    <span className="block">{d.day}</span>
                    <span className="block text-[0.78rem] opacity-70">{d.date}</span>
                  </button>
                ))}
              </div>

              <p className="u-label mt-7 text-navy/55">Time</p>
              <div className="mt-3 flex gap-2">
                {shop.slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={slot === s}
                    onClick={() => setSlot(s)}
                    className={`h-11 border px-5 text-[0.9rem] transition-colors ${slot === s ? "border-navy bg-navy text-white" : "border-navy/25 hover:border-navy"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={count === 0 || !day}
                onClick={() => setPlaced(`JSF-${String(Math.floor(1000 + Math.random() * 9000))}`)}
                className="mt-9 h-14 w-full bg-navy text-[0.85rem] font-medium uppercase tracking-[0.22em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
              >
                Reserve for collection
              </button>
              <p aria-live="polite" className="mt-3 min-h-[1.5rem] text-[0.9rem] text-navy/60">
                {placed
                  ? `Preview ${placed}: ${count} ${count === 1 ? "item" : "items"} for ${chosen?.day} ${chosen?.date}, ${slot.toLowerCase()}. Nothing has been sent or charged.`
                  : count > 0 && !day
                    ? "Choose a collection day."
                    : ""}
              </p>
              <p className="mt-6 text-[0.85rem] text-navy/45">{shop.preview}</p>
              <p className="mt-2 text-[0.85rem] text-navy/45">
                Buying for a restaurant or shop?{" "}
                <Link href="/work-with-us/#kitchens" className="border-b border-navy/30 text-navy/70 hover:text-navy">
                  Trade orders
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A slim bar once something is in the order, so it is never lost. */}
      {count > 0 && !placed ? (
        <a
          href="#collection"
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between gap-6 bg-navy px-5 py-4 sm:w-[26rem] text-white shadow-[0_18px_40px_-18px_rgba(10,31,51,0.7)] sm:inset-x-auto sm:right-6"
        >
          <span className="text-[0.95rem]">
            {count} {count === 1 ? "item" : "items"}
            {priced ? `, ${gbp(total)}` : ""}
          </span>
          <span className="text-[0.8rem] font-medium uppercase tracking-[0.2em]">Choose collection &darr;</span>
        </a>
      ) : null}
    </>
  );
}
