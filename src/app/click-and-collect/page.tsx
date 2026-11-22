import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, Words } from "@/components/Reveal";
import { BasketLink } from "@/components/ShopBits";
import { shop } from "@/lib/site";

export const metadata: Metadata = {
  title: shop.title,
  description: shop.lede,
};

/**
 * The shop is a short list: each product is a boxed card that opens its
 * own page, where the size and quantity are chosen. The collection day
 * is picked in the basket.
 */
export default function Page() {
  return (
    <>
      <section className="bg-abyss pb-14 pt-36 sm:pt-44">
        <div className="u-wrap flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal as="p" mode="fade" className="u-label text-kelp">
              Collection only
            </Reveal>
            <Words as="h1" text={shop.title} className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,5rem)] leading-[1.05]" />
          </div>
          <Reveal mode="rise" className="max-w-[38ch] text-foam/75">
            {shop.lede}
          </Reveal>
        </div>
      </section>

      <section className="bg-white pb-20 pt-10 text-navy sm:pb-28">
        <div className="u-wrap">
          <div className="flex items-center justify-between border-b border-navy/15 pb-4">
            <p className="u-label" style={{ color: "#8a6a2a" }}>
              Choose a product
            </p>
            <BasketLink />
          </div>

          <ul className="mx-auto mt-8 grid max-w-[44rem] gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {shop.items.map((it, i) => (
              <Reveal as="li" key={it.key} mode="rise" delay={i * 100}>
                <Link
                  href={`/click-and-collect/${it.key}/`}
                  className="group flex h-full items-center gap-4 border border-navy/15 bg-foam/40 p-3 transition-colors duration-500 hover:border-navy sm:block sm:p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden sm:aspect-[4/3] sm:h-auto sm:w-auto">
                    <Image
                      src={it.image}
                      alt={it.alt}
                      fill
                      sizes="(min-width:640px) 20rem, 96px"
                      className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="sm:mt-4">
                    <p className="u-label text-[0.62rem]" style={{ color: "#8a6a2a" }}>
                      {it.kicker}
                    </p>
                    <h2 className="mt-1 font-[family-name:var(--font-display)] text-[1.6rem] font-normal sm:text-[1.8rem]">{it.name}</h2>
                    <p className="mt-0.5 text-[0.9rem] text-navy/60">
                      {it.packs[0].label} to {it.packs[it.packs.length - 1].label.toLowerCase()}
                    </p>
                    <span className="u-label mt-3 inline-block border-b border-navy/40 pb-1 text-[0.62rem] transition-colors group-hover:border-navy">
                      Choose
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
