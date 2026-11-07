import Image from "next/image";
import Link from "next/link";
import PageHero from "./PageHero";
import { Reveal, Words } from "./Reveal";
import { mailto, products, type Product } from "@/lib/site";

/** One template for both crops: the oysters and the kelp share a shape. */
export default function ProductPage({ p }: { p: Product }) {
  const other = products.find((x) => x.slug !== p.slug)!;

  return (
    <>
      <PageHero
        label={p.aka ? `${p.latin} / ${p.aka}` : p.latin}
        title={p.name}
        sub={p.lede}
        image={p.photos[0].src}
        alt={p.photos[0].alt}
      />

      {/* The pitch, with the enquiry right beside it. */}
      <section className="relative overflow-hidden bg-foam py-24 text-navy sm:py-32">
        <div className="u-wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal
              mode="rise"
              className={`u-display mb-10 max-w-[30ch] italic text-teal ${p.describe ? "text-[clamp(1.5rem,2.6vw,2.2rem)]" : "text-[clamp(2.4rem,5vw,4.2rem)]"}`}
            >
              {p.describe ?? p.card}
            </Reveal>
            {p.body.map((b, i) => (
              <Reveal
                key={i}
                mode="rise"
                delay={i * 100}
                className="u-body mt-6 max-w-[60ch]"
              >
                {b}
              </Reveal>
            ))}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <Image src={p.art} alt="" width={880} height={880} className="u-bob w-[70%] max-w-[18rem]" />
              <p className="u-label mt-6 text-teal">To order</p>
              <p className="mt-3 max-w-[32ch]">
                Tell us what you are after and where you are, and we will come back to you.
              </p>
              <a href={mailto(p.enquiry)} className="u-btn u-btn--navy mt-6">
                {p.cta}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {p.uses ? (
        <section aria-labelledby="uses-title" className="bg-teal-deep py-24 sm:py-32">
          <div className="u-wrap">
            <Words as="h2" text="One crop, a huge range of uses." className="u-display max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)]" />
            <div className="mt-16 grid gap-y-14 md:grid-cols-12">
              {p.uses.map((u, i) => (
                <Reveal
                  key={u.title}
                  mode="rise"
                  delay={i * 120}
                  className={["md:col-span-5", "md:col-span-5 md:col-start-8 md:mt-24", "md:col-span-6 md:col-start-3"][i]}
                >
                  <p className="u-label text-kelp">0{i + 1}</p>
                  <h3 className="u-display mt-3 text-[clamp(1.8rem,3vw,2.6rem)] italic">{u.title}</h3>
                  <p className="u-body mt-4 text-foam/85">{u.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Their photographs, in a rail that runs off the edge. */}
      <section aria-label={`Photographs of the ${p.name}`} className="bg-abyss py-20">
        <div className="u-rail gap-4 pl-[var(--gutter)] pr-[var(--gutter)]">
          {p.photos.map((ph, i) => (
            <Reveal key={ph.src} mode="port" delay={i * 120} className="w-[78vw] sm:w-[44vw] lg:w-[32vw]">
              <div className="relative aspect-[3/4]">
                <Image src={ph.src} alt={ph.alt} fill sizes="(min-width:1024px) 32vw, 78vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-aqua text-navy">
        <Link href={`/${other.slug}/`} className="group u-wrap flex items-center justify-between gap-6 py-16">
          <span>
            <span className="u-label block">Grown alongside</span>
            <span className="u-display mt-2 block text-[clamp(2.2rem,6vw,5rem)]">{other.name}</span>
          </span>
          <span
            aria-hidden="true"
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-navy text-2xl text-foam transition-transform duration-500 group-hover:translate-x-2"
          >
            &rarr;
          </span>
        </Link>
      </section>
    </>
  );
}
