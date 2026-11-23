import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, GATE_TOKEN } from "@/lib/gate";

/** What a visitor may reach before entering the password. */
const OPEN = new Set(["/img/logo-stacked-dark.png", "/icon.png"]);

/**
 * Every page, photograph and film sits behind the password. A visitor
 * without the cookie is sent to /unlock and returned to where they were
 * going once they have entered it.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/unlock") || pathname.startsWith("/api/unlock") || OPEN.has(pathname)) {
    return NextResponse.next();
  }
  if (request.cookies.get(GATE_COOKIE)?.value === GATE_TOKEN) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the framework's own script and style files.
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
