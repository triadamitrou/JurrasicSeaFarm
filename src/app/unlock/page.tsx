"use client";

import { useState } from "react";

/**
 * The door. A full-screen panel over everything else: the logo, one
 * field and one button. A wrong password says so; a right one goes on
 * to the page that was asked for.
 */
export default function Unlock() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "wrong">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (!res?.ok) {
      setState("wrong");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next") ?? "/";
    // Only ever go to a page on this site.
    window.location.assign(next.startsWith("/") && !next.startsWith("//") ? next : "/");
  }

  return (
    <section className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#1f2a45] px-6 py-10 text-[#f4f0e8]">
      <form onSubmit={submit} className="w-full max-w-[22rem] text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo-stacked-dark.png" alt="Jurassic Seafarms" width={624} height={700} className="mx-auto h-auto w-[11rem]" />
        <h1 className="mt-10 font-[family-name:var(--font-cormorant)] text-[2rem] leading-tight">This site is private</h1>
        <p className="mt-2 text-[0.95rem] opacity-70">Enter the password to come in.</p>

        <label htmlFor="gate-password" className="sr-only">
          Password
        </label>
        <input
          id="gate-password"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setState("idle");
          }}
          aria-invalid={state === "wrong"}
          aria-describedby="gate-message"
          placeholder="Password"
          className="mt-8 h-14 w-full border border-[#f4f0e8]/35 bg-transparent px-4 text-center text-[1.05rem] text-[#f4f0e8] placeholder:text-[#f4f0e8]/40 focus:border-[#e3c29e] focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "busy" || !password}
          className="mt-3 h-14 w-full bg-[#e3c29e] text-[0.8rem] font-medium uppercase tracking-[0.28em] text-[#1f2a45] transition-opacity disabled:opacity-50"
        >
          {state === "busy" ? "Checking" : "Enter"}
        </button>
        <p id="gate-message" role="alert" className="mt-4 min-h-[1.5rem] text-[0.92rem] text-[#e3c29e]">
          {state === "wrong" ? "That password is not right. Try again." : ""}
        </p>
      </form>
    </section>
  );
}
