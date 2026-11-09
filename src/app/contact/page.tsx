import type { Metadata } from "next";
import ContactScene from "@/components/ContactScene";
import MessageForm from "@/components/MessageForm";
import { Reveal, Words } from "@/components/Reveal";
import { contact, mailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: contact.lede,
};

/**
 * Few words, a lot of water. The farm's address already sits in the
 * footer, so this page is the greeting, the email and the form, floating
 * in the harbour scene.
 */
export default function Page() {
  return (
    <ContactScene>
      <section className="relative pb-[34vh] pt-40 text-navy sm:pt-48">
        <div className="u-wrap grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div className="lg:pt-10">
            <Words as="h1" text={contact.title} className="u-display text-[clamp(3.6rem,11vw,9rem)]" stagger={110} />
            <a
              href={mailto()}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-navy px-5 py-3 text-[1rem] font-semibold text-foam transition-transform duration-500 hover:-translate-y-0.5"
            >
              <span aria-hidden="true" className="u-mark w-6 text-aqua" />
              {site.email}
            </a>
          </div>

          <Reveal mode="rise" delay={250}>
            <div className="rotate-[1.2deg] rounded-[2.25rem] bg-foam/95 p-7 shadow-[0_30px_80px_-30px_rgba(10,31,51,0.55)] backdrop-blur-md transition-transform duration-700 hover:rotate-0 sm:p-10">
              <MessageForm />
            </div>
          </Reveal>
        </div>
      </section>
    </ContactScene>
  );
}
