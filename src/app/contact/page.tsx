import type { Metadata } from "next";
import MessageForm from "@/components/MessageForm";
import { Reveal, Words } from "@/components/Reveal";
import { contact, mailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: contact.lede,
};

export default function Page() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-aqua pb-24 pt-36 text-navy sm:pt-44">
      {/* The header text is foam; give the top of this light page a band of deep water under it. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-abyss" />
      <div className="u-wrap relative grid gap-16 lg:grid-cols-[1fr_1.25fr]">
        <div>
          <p className="u-label">Contact</p>
          <Words as="h1" text={contact.title} className="u-display mt-4 text-[clamp(3.4rem,10vw,8rem)]" />
          <Reveal mode="rise" className="mt-6 max-w-[38ch] text-[1.1rem]">
            {contact.lede}
          </Reveal>
          <a href={mailto()} className="u-link mt-6 inline-block text-[1.15rem] font-semibold">
            {site.email}
          </a>

          <dl className="mt-14 grid gap-8 sm:grid-cols-2">
            <div>
              <dt className="u-label text-teal">The farm</dt>
              <dd className="mt-3">{site.farm}</dd>
            </div>
            <div>
              <dt className="u-label text-teal">Registered address</dt>
              <dd className="mt-3 leading-relaxed">
                {site.registered.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <Reveal mode="rise" delay={200} className="rounded-[2px] bg-foam p-7 sm:p-10">
          <MessageForm />
        </Reveal>
      </div>
    </section>
  );
}
