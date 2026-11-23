import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { GATE_COOKIE, GATE_TOKEN } from "@/lib/gate";

/** Checks the password and, if right, sets the cookie that opens the site for 30 days. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  const given = createHash("sha256").update(String(body.password ?? "")).digest("hex");
  const ok = timingSafeEqual(Buffer.from(given), Buffer.from(GATE_TOKEN));
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, GATE_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
