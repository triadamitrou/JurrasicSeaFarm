"use client";

import { useState } from "react";
import { contact, mailto } from "@/lib/site";

/**
 * Their "Say hello" form, without a server: it writes the message into
 * an email addressed to the farm, with the subject their own buttons use.
 */
export default function MessageForm({ defaultTopic = contact.topics[0] }: { defaultTopic?: string }) {
  const [topic, setTopic] = useState(defaultTopic);
  const [sent, setSent] = useState(false);

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const body = [
          String(f.get("message") || ""),
          "",
          [f.get("name"), f.get("organisation")].filter(Boolean).join(", "),
          String(f.get("email") || ""),
        ]
          .join("\n")
          .trim();
        window.location.href = mailto(topic, body);
        setSent(true);
      }}
    >
      <fieldset>
        <legend className="u-label mb-3 opacity-70">What is it about?</legend>
        <div className="flex flex-wrap gap-2">
          {contact.topics.map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-full px-4 py-2 text-[0.88rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-kelp ${topic === t ? "bg-navy text-foam" : "shadow-[inset_0_0_0_1.5px_currentColor]"}`}
            >
              <input
                type="radio"
                name="topic"
                value={t}
                checked={topic === t}
                onChange={() => setTopic(t)}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">First name</span>
          <input name="name" autoComplete="given-name" placeholder="First name" className="u-field" />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="Email *" className="u-field" />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Business or organisation</span>
        <input name="organisation" autoComplete="organization" placeholder="Business or organisation, if any" className="u-field" />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea name="message" rows={4} required placeholder="Your message in a bottle *" className="u-field resize-y" />
      </label>

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="u-btn u-btn--navy">
          Send
          <span aria-hidden="true">&rarr;</span>
        </button>
        <p aria-live="polite" className="text-[0.92rem]">
          {sent ? contact.thanks : ""}
        </p>
      </div>
    </form>
  );
}
