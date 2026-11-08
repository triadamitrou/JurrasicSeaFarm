import Icon from "./Icon";
import { Reveal } from "./Reveal";
import { mailto, type Product } from "@/lib/site";

type Use = NonNullable<Product["uses"]>[number];

/**
 * One section per field, reached from the widgets above. Each holds the
 * industries it serves and a wall for how customers have used the kelp.
 *
 * The farm has not published any customer stories or photographs yet,
 * so the wall is silent frames sized for the real thing: a large
 * photograph and two story cards, each a photograph over its words. No
 * labels, no invented customers. Drop the real ones in when they exist.
 */
export default function UseCases({ uses }: { uses: Use[] }) {
  return (
    <div className="bg-foam text-navy">
      {uses.map((u, i) => (
        <section
          key={u.key}
          id={`use-${u.key}`}
          aria-labelledby={`use-${u.key}-title`}
          className={`scroll-mt-20 py-20 sm:py-28 ${i ? "border-t border-navy/15" : ""}`}
        >
          <div className="u-wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className={`lg:col-span-4 ${i % 2 ? "lg:order-2 lg:col-start-9" : ""}`}>
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-4">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-teal-deep text-kelp">
                    <Icon name={u.icon} className="h-8 w-8" />
                  </span>
                  <p className="u-label text-teal">
                    0{i + 1} / {u.sectors.length} {u.sectors.length === 1 ? "industry" : "industries"}
                  </p>
                </div>
                <h2 id={`use-${u.key}-title`} className="u-display mt-5 text-[clamp(2.2rem,4.4vw,3.8rem)]">
                  {u.title}
                </h2>
                <ul className="mt-6 grid gap-3">
                  {u.sectors.map((s) => (
                    <li key={s.label} className="flex items-center gap-3 border-b border-navy/15 pb-3 text-[1.02rem]">
                      <Icon name={s.icon} className="h-6 w-6 text-teal" />
                      {s.label}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href={mailto(`Seaweed Enquiry: ${u.title}`)} className="u-btn u-btn--navy">
                    Talk to us about this
                  </a>
                  <a href="#uses" className="u-link text-[0.88rem]">
                    All uses &uarr;
                  </a>
                </div>
              </div>
            </div>

            {/* How customers use it: silent frames until there are real ones. */}
            <div className={`lg:col-span-8 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-5"}`}>
              <h3 className="u-label text-teal">In use</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Reveal mode="fade" className="sm:col-span-2">
                  <div className="aspect-[16/9] rounded-[3px] bg-navy/[0.07]" />
                </Reveal>
                {[0, 1].map((n) => (
                  <Reveal key={n} mode="rise" delay={n * 120}>
                    <article className="rounded-[3px] border border-navy/10 bg-white/60 p-4">
                      <div className="aspect-[3/2] rounded-[2px] bg-navy/[0.07]" />
                      <div aria-hidden="true" className="mt-4 space-y-2.5">
                        <div className="h-3.5 w-2/3 rounded-full bg-navy/[0.09]" />
                        <div className="h-2.5 w-full rounded-full bg-navy/[0.06]" />
                        <div className="h-2.5 w-11/12 rounded-full bg-navy/[0.06]" />
                        <div className="h-2.5 w-1/2 rounded-full bg-navy/[0.06]" />
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
