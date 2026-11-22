import type { Metadata } from "next";
import Link from "next/link";
import { BasketView } from "@/components/ShopBits";

export const metadata: Metadata = { title: "Basket" };

export default function Page() {
  return (
    <section className="min-h-[80svh] bg-white pb-16 pt-28 text-navy sm:pb-28 sm:pt-36">
      <div className="u-wrap">
        <Link href="/click-and-collect/" className="u-label text-navy/55 hover:text-navy">
          &larr; Click and collect
        </Link>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,4.6rem)] font-normal leading-[1.05]">Your basket</h1>
        <div className="mt-8 border-t border-navy/15 pt-10 sm:mt-10">
          <BasketView />
        </div>
      </div>
    </section>
  );
}
