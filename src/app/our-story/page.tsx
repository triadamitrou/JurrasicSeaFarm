import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Parallax, Reveal, Words } from "@/components/Reveal";
import { products, story } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: story.lede,
};

export default function Page() {
  return (
    <>
      <PageHero
        label="Our story"
        title="Lydia and Andy"
        sub={story.lede}
        image="/img/oyster-bags.jpg"
        alt="The farm's oyster bags in a line across Portland Harbour"
        position="center 70%"
      />

      {/* The turn: why two people from outside aquaculture took it on. */}
      <section className="relative overflow-hidden bg-foam py-24 text-navy sm:py-36">
        <div className="u-wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="u-label text-teal">Since {2022}</p>
            <Words
              as="h2"
              text="We wanted to be part of the change, not the problem."
              className="u-display mt-5 max-w-[18ch] text-[clamp(2.4rem,5.4vw,4.8rem)]"
            />
            <Reveal mode="rise" className="u-body mt-8 max-w-[56ch]">
              {story.turn}
            </Reveal>
          </div>
          <div className="relative grid grid-cols-2 gap-4 lg:col-span-5">
            <Reveal mode="port" className="mt-16">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/img/founder-beach.jpg"
                  alt="One of the founders on the beach, windswept and smiling"
                  fill
                  sizes="(min-width:1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal mode="port" delay={160}>
              <div className="relative aspect-[3/4]">
                <Image
                  src="/img/founder-boat.jpg"
                  alt="One of the founders in the boat at the farm, in oilskins and gloves"
                  fill
                  sizes="(min-width:1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* IMTA, said plainly, then said their way. */}
      <section className="relative overflow-hidden bg-teal-deep py-24 sm:py-32">
        <Image
          src="/img/wc-reef.webp"
          alt=""
          width={1000}
          height={562}
          className="pointer-events-none absolute -bottom-6 -right-10 w-[22rem] opacity-50 sm:w-[34rem]"
        />
        <div className="u-wrap relative grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="u-label text-kelp">Integrated Multi Trophic Aquaculture</p>
            <h2 className="u-display mt-5 text-[clamp(2.4rem,5vw,4.4rem)] italic">{story.aside}</h2>
          </div>
          <Reveal mode="rise" className="u-body text-foam/85">
            {story.imta}
          </Reveal>
        </div>
      </section>

      {/* Why: food security, the ocean, regenerative farming. */}
      <section className="bg-abyss py-24 sm:py-32">
        <div className="u-wrap grid gap-10 md:grid-cols-12">
          <Reveal mode="port" className="md:col-span-5">
            <div className="relative aspect-[4/5]">
              <Image
                src="/img/founders-boat.jpg"
                alt="Lydia and Andy heading out across the harbour"
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="md:col-span-6 md:col-start-7 md:self-center">
            {story.why.map((w, i) => (
              <Reveal
                key={i}
                mode="rise"
                delay={i * 120}
                className={i === 1 ? "u-display mt-8 text-[clamp(1.6rem,2.8vw,2.4rem)]" : "u-body text-foam/85"}
              >
                {w}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Their products, then the voyage. */}
      <section className="relative overflow-hidden bg-foam py-24 text-navy sm:py-32">
        <div className="u-wrap">
          <Reveal mode="rise" className="u-display max-w-[30ch] text-[clamp(1.5rem,2.6vw,2.2rem)]">
            {story.products}
          </Reveal>
          <p className="mt-6 text-[1.05rem]">Dive in and discover more about our Pacific Oysters and Sugar Kelp.</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}/`}
                className="group flex items-center justify-between gap-4 bg-navy px-7 py-7 text-foam transition-colors duration-500 hover:bg-teal-deep"
              >
                <span>
                  <span className="u-display block text-[clamp(1.6rem,2.6vw,2.2rem)]">{p.name}</span>
                  <span className="u-latin text-aqua">{p.latin}</span>
                </span>
                <span aria-hidden="true" className="text-2xl transition-transform duration-500 group-hover:translate-x-2">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate py-24 sm:py-28">
        <div className="u-wrap grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Words as="h2" text="Our voyage has just begun." className="u-display text-[clamp(2.4rem,5.4vw,4.6rem)]" />
            <p className="mt-6 max-w-[48ch] text-[1.05rem] text-foam/90">
              If you would like us to stay in touch as we plot a course for the future, drop us a line.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact/" className="u-btn">
                Say hello
              </Link>
              <Link href="/work-with-us/" className="u-btn u-btn--line text-foam">
                <span>Work with us</span>
              </Link>
            </div>
          </div>
          <Parallax speed={0.08}>
            <Image src="/img/wc-fish.webp" alt="" width={1000} height={715} className="u-bob mx-auto w-[min(24rem,90%)]" />
          </Parallax>
        </div>
      </section>
    </>
  );
}
