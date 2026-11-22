import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BasketLink, BuyBox } from "@/components/ShopBits";
import { shop } from "@/lib/site";

export function generateStaticParams() {
  return shop.items.map((i) => ({ key: i.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const it = shop.items.find((x) => x.key === key);
  return it ? { title: `${it.name} | Click and collect`, description: it.about } : {};
}

/** One product: its photograph on one side, the buying panel on the other. */
export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const it = shop.items.find((x) => x.key === key);
  if (!it) notFound();

  return (
    <section className="bg-white pb-16 pt-28 text-navy sm:pb-28 sm:pt-36">
      <div className="u-wrap">
        <div className="flex items-center justify-between">
          <Link href="/click-and-collect/" className="u-label text-navy/55 hover:text-navy">
            &larr; Click and collect
          </Link>
          <BasketLink />
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
          <div className="relative aspect-[16/10] overflow-hidden md:sticky md:top-28 md:aspect-[4/5] md:self-start">
            <Image src={it.image} alt={it.alt} fill priority sizes="(min-width:768px) 48vw, 100vw" className="object-cover" />
          </div>

          <div>
            <p className="u-label" style={{ color: "#8a6a2a" }}>
              {it.kicker}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[1.05]">{it.name}</h1>
            <p className="mt-4 max-w-[46ch] text-navy/70">{it.about}</p>

            <div className="mt-8">
              <BuyBox item={it} />
            </div>

            <ul className="mt-6 space-y-2 border-t border-navy/15 pt-6 text-[0.92rem] text-navy/65">
              <li className="u-label text-[0.62rem]" style={{ color: "#8a6a2a" }}>
                Collection and keeping
              </li>
              <li>Collected from {shop.collectFrom}.</li>
              {it.care.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
