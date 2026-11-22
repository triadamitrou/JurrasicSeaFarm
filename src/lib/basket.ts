"use client";

import { useSyncExternalStore } from "react";

/**
 * The basket, kept in the browser so it survives moving between the
 * shop, a product page and the basket. Nothing is sent anywhere until
 * the order email is opened.
 */
export type BasketLine = { key: string; name: string; pack: string; grade?: string; qty: number };

const KEY = "jsf1:basket:v1";
const EMPTY: BasketLine[] = [];
let current: BasketLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function save(next: BasketLine[]) {
  current = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the basket still works for this visit.
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  if (!loaded) {
    loaded = true;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) current = JSON.parse(raw) as BasketLine[];
    } catch {
      current = EMPTY;
    }
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useBasket() {
  return useSyncExternalStore(subscribe, () => current, () => EMPTY);
}

const same = (a: BasketLine, b: Omit<BasketLine, "qty">) => a.key === b.key && a.pack === b.pack && a.grade === b.grade;

export function addToBasket(line: BasketLine) {
  const hit = current.find((l) => same(l, line));
  save(hit ? current.map((l) => (l === hit ? { ...l, qty: l.qty + line.qty } : l)) : [...current, line]);
}

export function setQty(index: number, qty: number) {
  save(current.flatMap((l, i) => (i !== index ? [l] : qty <= 0 ? [] : [{ ...l, qty }])));
}

export function clearBasket() {
  save([]);
}
