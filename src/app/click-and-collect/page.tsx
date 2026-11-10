import type { Metadata } from "next";
import ClickCollect from "@/components/ClickCollect";
import { Reveal, Words } from "@/components/Reveal";
import { shop } from "@/lib/site";

export const metadata: Metadata = {
  title: shop.title,
  description: shop.lede,
};

/**
 * Short and quiet at the top, then straight to the counter. The dark
 * band keeps the header readable; everything below it is white.
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
      <ClickCollect />
    </>
  );
}
