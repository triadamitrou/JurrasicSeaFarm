import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import MessageForm from "@/components/MessageForm";
import { Reveal } from "@/components/Reveal";
import { mailto, work } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work with us",
  description: work.lede,
};

export default function Page() {
  return (
    <>
      <PageHero
        label="Work with us"
        title="Grown together"
        sub={work.lede}
        image="/img/kelp-pontoon.jpg"
        alt="The farm boat at the pontoon, loaded with kelp"
        position="center 60%"
      />

      {/* Each way in gets a row of its own, alternating sides. */}
      <section aria-label="Ways to work with us" className="bg-foam py-20 text-navy sm:py-28">
        <div className="u-wrap">
          <ol className="grid gap-20 sm:gap-28">
            {work.ways.map((w, i) => (
              <li
                key={w.key}
                id={w.key}
                className="grid scroll-mt-28 items-center gap-8 md:grid-cols-12 md:gap-10"
              >
                <Reveal
                  mode="port"
                  className={`md:col-span-5 ${i % 2 ? "md:order-2 md:col-start-8" : ""}`}
                >
                  <div className="relative aspect-[5/4]">
                    <Image src={w.image} alt="" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
                  </div>
                </Reveal>
                <div className={`md:col-span-6 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                  <p className="u-label flex items-center gap-3 text-teal">
                    <span className="tabular-nums">0{i + 1}</span>
                    <span className="h-px w-8 bg-current" />
                    {w.grows}
                  </p>
                  <h2 className="u-display mt-4 text-[clamp(2rem,3.8vw,3.4rem)]">{w.title}</h2>
                  <p className="u-body mt-5 max-w-[50ch]">{w.body}</p>
                  <a href={mailto(w.subject)} className="u-btn u-btn--navy mt-7">
                    Start a conversation
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Not sure where you fit. */}
      <section id="enquire" className="relative overflow-hidden bg-aqua py-24 text-navy sm:py-32">
        <Image
          src="/img/wc-kelp-fish.webp"
          alt=""
          width={800}
          height={1000}
          className="u-bob pointer-events-none absolute -bottom-10 left-[22%] hidden w-[16rem] opacity-60 lg:block"
        />
        <div className="u-wrap relative grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="u-display max-w-[14ch] text-[clamp(2.4rem,5vw,4.4rem)]">Not sure where you fit?</h2>
            <p className="mt-6 max-w-[40ch] text-[1.08rem]">{work.closing}</p>
          </div>
          <div className="lg:pr-24">
            <MessageForm defaultTopic="Working together" />
          </div>
        </div>
      </section>
    </>
  );
}
