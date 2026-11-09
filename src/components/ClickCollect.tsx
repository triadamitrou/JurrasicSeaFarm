"use client";

import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";
import { shop } from "@/lib/site";

type Line = { item: string; pack: string; qty: number };

const gbp = (n: number) => `£${n.toFixed(2)}`;

const noop = () => () => {};

/** The next seven days, from tomorrow. Only in the browser, so the server and browser agree. */
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
 * A shop that looks and behaves like one, without taking an order:
 * choose a pack, add to the basket, pick a collection slot, and the
 * last step says plainly that nothing was sent.
 */
export default function ClickCollect() {
  const [picked, setPicked] = useState<Record<string, string>>(
    Object.fromEntries(shop.items.map((i) => [i.key, i.packs[1].key])),
  );
  const [qty, setQty] = useState<Record<string, number>>(Object.fromEntries(shop.items.map((i) => [i.key, 1])));
  const [basket, setBasket] = useState<Line[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string>(shop.slots[0]);
  const [placed, setPlaced] = useState<string | null>(null);
  const days = useDays();

  const find = (item: string, pack: string) => {
    const i = shop.items.find((x) => x.key === item)!;
    return { i, p: i.packs.find((x) => x.key === pack)! };
  };

  const add = (item: string) => {
    const pack = picked[item];
    const n = qty[item];
    setPlaced(null);
    setBasket((b) => {
      const hit = b.find((l) => l.item === item && l.pack === pack);
      if (hit) return b.map((l) => (l === hit ? { ...l, qty: l.qty + n } : l));
      return [...b, { item, pack, qty: n }];
    });
  };

  const change = (idx: number, d: number) =>
    setBasket((b) => b.flatMap((l, i) => (i !== idx ? [l] : l.qty + d <= 0 ? [] : [{ ...l, qty: l.qty + d }])));

  const total = useMemo(() => {
    let sum = 0;
    for (const l of basket) {
      const { p } = find(l.item, l.pack);
      if (p.price === null) return null;
      sum += p.price * l.qty;
    }
    return sum;
  }, [basket]);

  const count = basket.reduce((s, l) => s + l.qty, 0);
  const chosenDay = days.find((d) => d.key === day);

  return (
    <section aria-label="Shop" className="bg-abyss pb-24 pt-14 text-foam sm:pb-32">
      <div className="u-wrap">
        <p
          role="note"
          className="mb-12 flex items-start gap-3 rounded-[3px] border border-kelp/35 px-4 py-3 text-[0.9rem] text-foam/80"
        >
          <span aria-hidden="true" className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full bg-kelp" />
          {shop.preview}
        </p>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* The two products */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
            {shop.items.map((it) => {
              const pack = it.packs.find((p) => p.key === picked[it.key])!;
              return (
                <article
                  key={it.key}
                  className={`flex flex-col sm:col-span-2 lg:grid lg:gap-10 ${it.key === "oysters" ? "lg:grid-cols-[1.15fr_1fr]" : "border-t border-foam/15 pt-10 lg:grid-cols-[0.75fr_1fr]"}`}
                >
                  <div className={`relative overflow-hidden rounded-[2px] bg-foam/5 ${it.key === "oysters" ? "aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[4/3] lg:aspect-auto lg:min-h-[17rem]"}`}>
                    <Image src={it.image} alt={it.alt} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" className="object-cover" />
                    {it.key === "oysters" ? (
                      <span className="u-label absolute left-4 top-4 rounded-full border border-kelp/60 bg-abyss/80 px-3 py-1.5 text-kelp backdrop-blur">
                        Premium, high yield
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                  {it.key === "oysters" ? <p className="u-label mt-6 text-kelp lg:mt-2">The main harvest</p> : <p className="u-label mt-6 text-foam/55">Grown alongside</p>}
                  <h2 className={`u-display mt-3 ${it.key === "oysters" ? "text-[clamp(2.2rem,3.6vw,3.2rem)]" : "text-[clamp(1.8rem,2.6vw,2.3rem)]"}`}>{it.name}</h2>
                  <p className="u-latin text-kelp">{it.latin}</p>
                  <p className="mt-3 max-w-[40ch] text-foam/75">{it.line}</p>

                  <fieldset className="mt-5">
                    <legend className="u-label mb-2.5 text-foam/55">Pack</legend>
                    <div className="flex flex-wrap gap-2">
                      {it.packs.map((p) => (
                        <label
                          key={p.key}
                          className={`cursor-pointer rounded-full px-4 py-2 text-[0.88rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-kelp ${picked[it.key] === p.key ? "bg-kelp text-abyss" : "shadow-[inset_0_0_0_1px_rgba(233,246,244,0.35)] hover:shadow-[inset_0_0_0_1px_var(--color-kelp)]"}`}
                        >
                          <input
                            type="radio"
                            name={`pack-${it.key}`}
                            value={p.key}
                            checked={picked[it.key] === p.key}
                            onChange={() => setPicked((s) => ({ ...s, [it.key]: p.key }))}
                            className="sr-only"
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                    <p className="text-[1.15rem] font-semibold">
                      {pack.price === null ? <ToConfirm dark /> : gbp(pack.price)}
                    </p>
                    <div className="flex items-center gap-3">
                      <Stepper
                        dark
                        label={`${it.name} quantity`}
                        value={qty[it.key]}
                        onChange={(v) => setQty((s) => ({ ...s, [it.key]: v }))}
                      />
                      <button type="button" onClick={() => add(it.key)} className="u-btn py-3">
                        Add to basket
                      </button>
                    </div>
                  </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* The basket */}
          <aside aria-label="Basket" className="lg:col-span-4">
            <div className="rounded-[2px] border border-kelp/30 bg-navy/70 p-6 text-foam sm:p-7 lg:sticky lg:top-28">
              <div className="flex items-baseline justify-between">
                <h2 className="u-display text-[1.8rem]">Basket</h2>
                <span className="u-label text-kelp">{count} {count === 1 ? "item" : "items"}</span>
              </div>

              {basket.length === 0 ? (
                <p className="mt-4 text-foam/70">Nothing here yet. Choose a pack and press Add.</p>
              ) : (
                <ul className="mt-4 divide-y divide-foam/15 border-y border-foam/15">
                  {basket.map((l, idx) => {
                    const { i, p } = find(l.item, l.pack);
                    return (
                      <li key={`${l.item}-${l.pack}`} className="flex items-center justify-between gap-3 py-3">
                        <div>
                          <p className="font-medium">{i.name}</p>
                          <p className="text-[0.85rem] text-foam/70">
                            {p.label}, {p.price === null ? "price to confirm" : gbp(p.price)}
                          </p>
                        </div>
                        <Stepper dark label={`${i.name} ${p.label} in basket`} value={l.qty} min={0} onChange={(v) => change(idx, v - l.qty)} />
                      </li>
                    );
                  })}
                </ul>
              )}

              <fieldset className="mt-6">
                <legend className="u-label mb-2.5 text-kelp">Collection day</legend>
                <div className="grid grid-cols-4 gap-1.5">
                  {days.map((d) => (
                    <label
                      key={d.key}
                      className={`cursor-pointer rounded-[3px] px-1 py-2 text-center text-[0.8rem] leading-tight transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-kelp ${day === d.key ? "bg-kelp text-abyss" : "bg-foam/[0.07] hover:bg-foam/15"}`}
                    >
                      <input type="radio" name="day" value={d.key} checked={day === d.key} onChange={() => setDay(d.key)} className="sr-only" />
                      <span className="block font-semibold">{d.day}</span>
                      {d.date}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-4">
                <legend className="u-label mb-2.5 text-kelp">Time</legend>
                <div className="flex gap-2">
                  {shop.slots.map((s) => (
                    <label
                      key={s}
                      className={`flex-1 cursor-pointer rounded-full py-2 text-center text-[0.88rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-kelp ${slot === s ? "bg-kelp text-abyss" : "shadow-[inset_0_0_0_1px_rgba(233,246,244,0.35)]"}`}
                    >
                      <input type="radio" name="slot" value={s} checked={slot === s} onChange={() => setSlot(s)} className="sr-only" />
                      {s}
                    </label>
                  ))}
                </div>
              </fieldset>

              <p className="mt-5 text-[0.88rem] text-foam/80">
                Collect from {shop.collectFrom}.{" "}
                <span className="text-kelp">{shop.collectNote}.</span>
              </p>

              <div className="mt-5 flex items-baseline justify-between border-t border-foam/15 pt-4">
                <span className="u-label text-kelp">Total</span>
                <span className="text-[1.3rem] font-semibold">
                  {basket.length === 0 ? gbp(0) : total === null ? <ToConfirm dark /> : gbp(total)}
                </span>
              </div>

              <button
                type="button"
                disabled={basket.length === 0 || !day}
                onClick={() => setPlaced(`JSF-${String(Math.floor(1000 + Math.random() * 9000))}`)}
                className="u-btn mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reserve for collection
              </button>
              {basket.length > 0 && !day ? (
                <p className="mt-2 text-center text-[0.82rem] text-foam/70">Choose a collection day first.</p>
              ) : null}

              <div aria-live="polite">
                {placed ? (
                  <div className="mt-5 rounded-[3px] bg-aqua p-4 text-navy">
                    <p className="u-label">Preview order {placed}</p>
                    <p className="mt-2 text-[0.92rem]">
                      {count} {count === 1 ? "item" : "items"} for collection on {chosenDay?.day} {chosenDay?.date},{" "}
                      {slot.toLowerCase()}.
                    </p>
                    <p className="mt-2 text-[0.85rem] text-navy/75">
                      This is a preview: no order has been sent and nothing has been charged.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>

        {/* How it works */}
        <ol className="mt-20 grid gap-8 border-t border-foam/15 pt-12 sm:grid-cols-3">
          {shop.steps.map((s, i) => (
            <li key={s.title}>
              <p className="u-label text-kelp">0{i + 1}</p>
              <h3 className="u-display mt-2 text-[1.7rem]">{s.title}</h3>
              <p className="mt-2 max-w-[32ch] text-foam/75">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* Trade buyers get their own way in. */}
        <a
          href="/work-with-us/#kitchens"
          className="group mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[2px] border border-foam/15 bg-navy/60 px-6 py-8 text-foam transition-colors duration-500 hover:border-kelp/60 sm:px-10"
        >
          <span>
            <span className="u-label block text-kelp">Trade and wholesale</span>
            <span className="u-display mt-2 block text-[clamp(1.6rem,3vw,2.4rem)]">
              Buying for a restaurant, fishmonger or shop?
            </span>
            <span className="mt-2 block text-foam/80">Ask about trade orders and larger volumes.</span>
          </span>
          <span
            aria-hidden="true"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-kelp text-xl text-abyss transition-transform duration-500 group-hover:translate-x-2"
          >
            &rarr;
          </span>
        </a>
      </div>
    </section>
  );
}

function ToConfirm({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[0.78rem] font-semibold uppercase tracking-[0.08em] ${dark ? "bg-kelp/25 text-kelp" : "bg-kelp/20 text-[#7a5d1c]"}`}>
      Price to confirm
    </span>
  );
}

function Stepper({
  value,
  onChange,
  label,
  min = 1,
  dark = false,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  min?: number;
  dark?: boolean;
}) {
  const btn = `grid h-9 w-9 place-items-center rounded-full text-lg leading-none transition-colors ${dark ? "hover:bg-foam/15" : "hover:bg-navy/10"}`;
  return (
    <div role="group" aria-label={label} className={`flex items-center rounded-full ${dark ? "shadow-[inset_0_0_0_1.5px_rgba(233,246,244,0.35)]" : "shadow-[inset_0_0_0_1.5px_currentColor]"}`}>
      <button type="button" aria-label="One fewer" onClick={() => onChange(Math.max(min, value - 1))} className={btn}>
        &minus;
      </button>
      <span aria-live="polite" className="w-6 text-center font-semibold tabular-nums">
        {value}
      </span>
      <button type="button" aria-label="One more" onClick={() => onChange(value + 1)} className={btn}>
        +
      </button>
    </div>
  );
}
