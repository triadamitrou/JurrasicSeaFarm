import Image from "next/image";
import Link from "next/link";
import PageHero from "./PageHero";
import Icon from "./Icon";
import UseCases from "./UseCases";
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
              className={`u-display u-feature mb-10 max-w-[30ch] text-teal ${p.describe ? "text-[clamp(1.5rem,2.6vw,2.2rem)]" : "text-[clamp(2.4rem,5vw,4.2rem)]"}`}
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
        <section id="uses" aria-label="Uses of Sugar Kelp" className="scroll-mt-16 bg-teal-deep py-24 sm:py-32">
          <div className="u-wrap">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
              <Words
                as="h2"
                text="One crop, many industries."
                className="u-display max-w-[14ch] text-[clamp(2.4rem,5vw,4.4rem)]"
              />
              {/* Every industry at a glance, before the detail. */}
              <Reveal mode="rise" className="lg:pb-2">
                <p className="text-foam/80">
                  Sugar Kelp from Portland Harbour serves {p.uses.flatMap((u) => u.sectors).length} industries
                  across three fields.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Industries served">
                  {p.uses.flatMap((u) => u.sectors).map((s) => (
                    <li
                      key={s.label}
                      className="flex items-center gap-2 rounded-full bg-foam/10 py-1.5 pl-2 pr-3.5 text-[0.85rem]"
                    >
                      <Icon name={s.icon} className="h-[1.1rem] w-[1.1rem] text-kelp" />
                      {s.label}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="mt-16 grid gap-y-14 md:grid-cols-12">
              {p.uses.map((u, i) => (
                <Reveal
                  key={u.key}
                  mode="rise"
                  delay={i * 120}
                  className={["md:col-span-5", "md:col-span-5 md:col-start-8 md:mt-24", "md:col-span-6 md:col-start-3"][i]}
                >
                  <a
                    href={`#use-${u.key}`}
                    className="group block h-full rounded-[3px] border border-foam/15 bg-foam/[0.04] p-6 transition-colors duration-500 hover:border-kelp/70 hover:bg-foam/[0.08] sm:p-8"
                  >
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-kelp/60 text-kelp transition-colors duration-500 group-hover:bg-kelp group-hover:text-teal-deep">
                        <Icon name={u.icon} className="h-7 w-7" />
                      </span>
                      <p className="u-label text-kelp">0{i + 1}</p>
                    </div>
                    <h3 className="u-display u-feature mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">{u.title}</h3>
                    <p className="u-body mt-4 text-foam/85">{u.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label={`${u.title}: industries`}>
                      {u.sectors.map((s) => (
                        <li key={s.label} className="flex items-center gap-2 text-[0.88rem] text-foam">
                          <Icon name={s.icon} className="h-5 w-5 text-aqua" />
                          {s.label}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-kelp">
                      How it is used
                      <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-y-1">
                        &darr;
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {p.uses ? <UseCases uses={p.uses} /> : null}

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
        <Link href={`/${other.slug}/`} className="group u-wrap flex items-center justify-between gap-6 pb-28 pt-16">
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
