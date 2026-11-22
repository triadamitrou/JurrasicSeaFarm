"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { addToBasket, clearBasket, setQty, useBasket } from "@/lib/basket";
import { shop, type ShopItem } from "@/lib/site";

const GOLD = "#8a6a2a";
const serif = "font-[family-name:var(--font-display)] font-normal";
const cta =
  "inline-flex min-h-[3.5rem] items-center justify-center bg-navy px-6 text-[0.82rem] font-medium uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90";

/** The link to the basket, with its count, shown on every shop page. */
export function BasketLink() {
  const count = useBasket().reduce((s, l) => s + l.qty, 0);
  return (
    <Link href="/click-and-collect/basket/" className="u-label inline-flex items-center gap-3 text-navy">
      Basket
      <span className="grid h-7 min-w-7 place-items-center bg-navy px-2 text-[0.72rem] tracking-normal text-white tabular-nums">{count}</span>
    </Link>
  );
}

function Stepper({ value, onChange, label, min = 1, tall = false }: { value: number; onChange: (n: number) => void; label: string; min?: number; tall?: boolean }) {
  return (
    <div role="group" aria-label={label} className={`flex items-stretch border border-navy/25 ${tall ? "h-14" : "h-12"}`}>
      <button type="button" aria-label="One fewer" onClick={() => onChange(Math.max(min, value - 1))} className="w-11 text-lg hover:bg-navy/5">
        &minus;
      </button>
      <span aria-live="polite" className="grid w-10 place-items-center tabular-nums">
        {value}
      </span>
      <button type="button" aria-label="One more" onClick={() => onChange(value + 1)} className="w-11 text-lg hover:bg-navy/5">
        +
      </button>
    </div>
  );
}

/** The buying panel on a product's page: size, a pack drop-down, how many, add. */
export function BuyBox({ item }: { item: ShopItem }) {
  const [grade, setGrade] = useState(item.grades ? item.grades[Math.min(1, item.grades.length - 1)] : undefined);
  const [pack, setPack] = useState(item.packs[Math.min(1, item.packs.length - 1)].label);
  const [qty, setQ] = useState(1);
  const [added, setAdded] = useState(false);
  const [open, setOpen] = useState(false);
  const chosen = item.packs.find((p) => p.label === pack)!;

  return (
    <div>
      {item.grades ? (
        <fieldset>
          <legend className="u-label text-navy/55">Size</legend>
          <div className="mt-3 flex gap-2">
            {item.grades.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={grade === g}
                onClick={() => setGrade(g)}
                className={`min-w-[3.5rem] border px-4 py-3 text-center transition-colors ${grade === g ? "border-navy bg-navy text-white" : "border-navy/25 hover:border-navy"}`}
              >
                {g}
              </button>
            ))}
          </div>
          {item.gradeNote ? <p className="mt-2 text-[0.88rem] text-navy/55">{item.gradeNote}</p> : null}
        </fieldset>
      ) : null}

      <div className={`grid grid-cols-[1fr_auto] gap-3 ${item.grades ? "mt-7" : ""}`}>
        <div>
          <p className="u-label text-navy/55" id={`pack-${item.key}`}>
            Pack{chosen.price !== null ? <span className="text-navy"> &ndash; £{chosen.price}</span> : null}
          </p>
          <div
            className="relative mt-3"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
          >
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-labelledby={`pack-${item.key}`}
              onClick={() => setOpen((v) => !v)}
              className="flex h-14 w-full items-center justify-between gap-3 border border-navy/25 px-4 text-left"
            >
              <span className="truncate">
                {chosen.label}
                {chosen.detail ? <span className="text-navy/55"> &ndash; {chosen.detail}</span> : null}
              </span>
              <svg viewBox="0 0 12 8" aria-hidden="true" className={`h-2 w-3 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                <path d="M0 0h12L6 8z" fill="currentColor" />
              </svg>
            </button>
            {open ? (
              <ul role="listbox" aria-labelledby={`pack-${item.key}`} className="absolute inset-x-0 top-full z-20 -mt-px border border-navy/25 bg-white shadow-[0_18px_40px_-20px_rgba(10,31,51,0.5)]">
                {item.packs.map((p) => (
                  <li key={p.label} role="option" aria-selected={pack === p.label} className="border-b border-navy/15 last:border-0">
                    <button
                      type="button"
                      onClick={() => {
                        setPack(p.label);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors ${pack === p.label ? "bg-navy text-white" : "hover:bg-navy/5"}`}
                    >
                      <span>
                        {p.label}
                        {p.detail ? <span className="opacity-70"> &ndash; {p.detail}</span> : null}
                      </span>
                      {p.price !== null ? <span className="tabular-nums">£{p.price}</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        <div>
          <p className="u-label text-navy/55">Quantity</p>
          <div className="mt-3">
            <Stepper value={qty} onChange={setQ} label="How many packs" tall />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          addToBasket({ key: item.key, name: item.name, pack, grade, qty });
          setAdded(true);
        }}
        className={`${cta} mt-4 w-full`}
      >
        Add to basket{chosen.price !== null ? ` – £${chosen.price * qty}` : ""}
      </button>
      {chosen.price === null ? <p className="mt-3 text-[0.88rem] text-navy/55">Price to confirm with the farm before collection.</p> : null}
      <p aria-live="polite" className="mt-2 min-h-[1.5rem] text-[0.92rem]">
        {added ? (
          <>
            Added.{" "}
            <Link href="/click-and-collect/basket/" className="border-b border-navy/40">
              View basket and choose a collection day
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}

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

/**
 * The basket: what was added, then the collection day and time picker
 * and the Reserve button. A preview: nothing is sent or charged.
 */
export function BasketView() {
  const lines = useBasket();
  const days = useDays();
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState(shop.slots[0]);
  const [placed, setPlaced] = useState<string | null>(null);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const chosen = days.find((d) => d.key === day);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="u-label" style={{ color: GOLD }}>
          Your collection
        </p>
        {lines.length === 0 ? (
          <>
            <p className="mt-5 text-navy/55">Nothing added yet.</p>
            <Link href="/click-and-collect/" className="mt-5 inline-block border-b border-navy/40">
              Choose a product
            </Link>
          </>
        ) : (
          <>
            <ul className="mt-5 border-t border-navy/12">
              {lines.map((l, i) => (
                <li key={`${l.key}-${l.pack}-${l.grade}`} className="flex items-center justify-between gap-4 border-b border-navy/12 py-4">
                  <div>
                    <p className={`${serif} text-[1.4rem]`}>{l.name}</p>
                    <p className="text-[0.92rem] text-navy/55">
                      {l.pack}
                      {l.grade ? `, size ${l.grade}` : ""}
                    </p>
                  </div>
                  <Stepper
                    value={l.qty}
                    min={0}
                    onChange={(n) => {
                      setPlaced(null);
                      setQty(i, n);
                    }}
                    label={`${l.name}, ${l.pack}`}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-baseline justify-between">
              <span className="u-label text-navy/55">Total</span>
              <span className="text-navy/55">To confirm</span>
            </div>
            <button type="button" onClick={clearBasket} className="mt-4 border-b border-navy/30 text-[0.88rem] text-navy/55">
              Empty the basket
            </button>
          </>
        )}
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
          className={`${cta} mt-9 w-full disabled:cursor-not-allowed disabled:opacity-30`}
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
          Collected from {shop.collectFrom}. Buying for a restaurant or shop?{" "}
          <Link href="/work-with-us/#kitchens" className="border-b border-navy/30 text-navy/70 hover:text-navy">
            Trade orders
          </Link>
        </p>
      </div>
    </div>
  );
}
