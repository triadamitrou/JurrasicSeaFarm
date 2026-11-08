import Image from "next/image";
import Link from "next/link";
import WaterColumn from "@/components/WaterColumn";
import { Parallax, Reveal, Words } from "@/components/Reveal";
import { fruits, goals, intro, mailto, products, site, story, work } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* 1. Hero: their own film of the kelp, full bleed. */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-abyss pb-16 sm:pb-24">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/kelp.mp4"
          poster="/img/kelp-underwater.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-abyss), color-mix(in srgb, var(--color-abyss) 30%, transparent) 55%, color-mix(in srgb, var(--color-abyss) 45%, transparent))",
          }}
        />
        <div className="u-wrap relative">
          <Reveal as="p" mode="fade" className="u-label text-aqua">
            {site.strapline}
          </Reveal>
          <Words
            as="h1"
            text={site.headline}
            className="u-display mt-5 max-w-[9em] text-[clamp(2.8rem,10.5vw,10rem)]"
            stagger={90}
          />
          <Reveal mode="rise" delay={500} className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/oysters/" className="u-btn">
              Our oysters
            </Link>
            <Link href="/seaweed/" className="u-btn u-btn--line text-foam">
              <span>Our seaweed</span>
            </Link>
            <span className="text-[0.88rem] text-foam/75">Grown in {site.farm}</span>
          </Reveal>
        </div>
      </section>

      {/* 3. Fruits of the sea, before the story: what they grow comes first. */}
      <section aria-labelledby="fruits-title" className="relative overflow-hidden bg-foam py-24 text-navy sm:py-32">
        <div className="u-wrap">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Words as="h2" text={fruits.title} className="u-display text-[clamp(2.8rem,7vw,6rem)]" />
            <Reveal mode="rise" className="u-body max-w-[52ch] lg:pb-3">
              {fruits.body}
            </Reveal>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-12 md:gap-6">
            {products.map((p, i) => (
              <Link
                key={p.slug}
                href={`/${p.slug}/`}
                className={`group block ${i === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-40"}`}
              >
                <Reveal mode="port" delay={i * 150} className="relative rounded-[2px]">
                  <div className={`relative ${i === 0 ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
                    <Image
                      src={p.image}
                      alt={p.photos[0].alt}
                      fill
                      sizes="(min-width: 768px) 55vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                    />
                  </div>
                </Reveal>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="u-display text-[clamp(1.9rem,3.4vw,3rem)]">{p.name}</h3>
                    <p className="u-latin mt-1 text-teal">{p.latin}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-2 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy text-foam transition-transform duration-500 group-hover:rotate-[-45deg]"
                  >
                    &rarr;
                  </span>
                </div>
                <p className="mt-3 max-w-[40ch] text-[1.05rem]">{p.card}</p>
              </Link>
            ))}
          </div>
        </div>
        <Image
          src="/img/wc-oysters.webp"
          alt=""
          width={876}
          height={881}
          className="u-bob pointer-events-none absolute -left-16 top-[44%] hidden w-[15rem] opacity-90 md:block"
          style={{ ["--bob" as string]: "-2s" }}
        />
      </section>

      {/* 4. The descent: how the farm works, from surface to depth. */}
      <WaterColumn />

      {/* 5. Who they are: later, not earlier. */}
      <section aria-labelledby="who-title" className="relative overflow-hidden bg-abyss py-24 sm:py-36">
        <div className="u-wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal mode="port" className="relative">
              <div className="relative aspect-square">
                <Image
                  src="/img/founders-boat.jpg"
                  alt="Lydia and Andy out on the farm boat in Portland Harbour"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <p className="u-label text-kelp">{intro.title}</p>
            <Words
              as="h2"
              text="Part of the change, not the problem."
              className="u-display mt-5 text-[clamp(2.4rem,5.4vw,4.8rem)] italic"
            />
            <Reveal mode="rise" className="u-body mt-8 max-w-[52ch] text-foam/85">
              {intro.body}
            </Reveal>
            <Reveal mode="rise" delay={120} className="u-body mt-5 max-w-[52ch] text-foam/85">
              {story.turn}
            </Reveal>
            <Reveal mode="rise" delay={240} className="mt-10">
              <Link href="/our-story/" className="u-btn">
                Read our story
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. A drop in the ocean: their UN goals, in their slate. */}
      <section aria-labelledby="goals-title" className="relative overflow-hidden bg-slate py-24 sm:py-32">
        <div className="u-wrap grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="goals-title" className="u-display max-w-[20ch] text-[clamp(1.8rem,3.6vw,3rem)]">
              {goals.title}
            </h2>
            {goals.body.map((b, i) => (
              <Reveal key={i} mode="rise" delay={i * 100} className="u-body mt-5 max-w-[56ch] text-foam/85">
                {b}
              </Reveal>
            ))}
          </div>
          <div className="relative">
            <Parallax speed={0.06}>
              <Image
                src="/img/wc-sea-disc.webp"
                alt=""
                width={885}
                height={984}
                className="mx-auto w-[min(22rem,80%)]"
              />
            </Parallax>
            <p className="u-display absolute inset-x-0 top-1/2 mx-auto max-w-[13ch] -translate-y-1/2 text-center text-[clamp(1.4rem,2.6vw,2rem)] italic text-foam [text-shadow:0_2px_18px_rgba(10,31,51,0.6)]">
              Many drops make up an ocean.
            </p>
          </div>
        </div>
        <div className="u-wrap mt-14">
          <Reveal mode="draw" className="h-px bg-foam/30" />
          <Reveal mode="rise" className="mt-8 max-w-[70ch] text-[1.05rem] text-foam/90">
            {goals.drop}
          </Reveal>
        </div>
      </section>

      {/* 7. Work with us: a list, not three cards. */}
      <section aria-labelledby="work-title" className="bg-foam py-24 text-navy sm:py-32">
        <div className="u-wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="u-label text-teal">Work with us</p>
            <Words
              as="h2"
              text="What we grow could be part of what you do."
              className="u-display mt-4 max-w-[14ch] text-[clamp(2.4rem,5vw,4.2rem)]"
            />
            <Reveal mode="rise" className="mt-8">
              <Link href="/work-with-us/" className="u-btn u-btn--navy">
                Ways to work with us
              </Link>
            </Reveal>
          </div>
          <ul className="border-t border-navy/20">
            {work.ways.map((w, i) => (
              <Reveal as="li" key={w.key} mode="rise" delay={i * 70} className="border-b border-navy/20">
                <Link
                  href={`/work-with-us/#${w.key}`}
                  className="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span className="u-display text-[clamp(1.3rem,2.2vw,1.8rem)] transition-transform duration-500 group-hover:translate-x-2">
                    {w.title}
                  </span>
                  <span className="shrink-0 text-[0.82rem] text-teal">{w.grows}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. A message in a bottle. */}
      <section className="relative overflow-hidden bg-aqua py-24 text-navy sm:py-28">
        <Image
          src="/img/wc-wave.webp"
          alt=""
          width={1000}
          height={493}
          className="pointer-events-none absolute inset-x-0 top-0 w-full opacity-70"
        />
        <div className="u-wrap relative flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="u-label">Want to say hello?</p>
            <h2 className="u-display mt-4 max-w-[16ch] text-[clamp(2.4rem,5.6vw,5rem)]">
              Drop us a line.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[1.05rem]">
              Or send us a message in a bottle to{" "}
              <a href={mailto()} className="u-link font-semibold">
                {site.email}
              </a>
            </p>
          </div>
          <Link href="/contact/" className="u-btn u-btn--navy">
            Say hello
          </Link>
        </div>
      </section>
    </>
  );
}
