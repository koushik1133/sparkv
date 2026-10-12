import { NextResponse, type NextRequest } from "next/server";

// Gate for the internal /team dashboard. Returns 404 (not 401) so the route's existence is not
// revealed. If TEAM_DASHBOARD_TOKEN is unset the route is always 404.
const COOKIE = "team_token";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function proxy(request: NextRequest) {
  const expected = process.env.TEAM_DASHBOARD_TOKEN;
  if (!expected) return new NextResponse(null, { status: 404 });

  const fromQuery = request.nextUrl.searchParams.get("token");
  const fromCookie = request.cookies.get(COOKIE)?.value;

  if (fromQuery && safeEqual(fromQuery, expected)) {
    // Move the token out of the URL into an httpOnly cookie, then redirect to the clean URL.
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("token");
    const res = NextResponse.redirect(clean);
    res.cookies.set(COOKIE, expected, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/team",
      maxAge: 60 * 60 * 12,
    });
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  if (fromCookie && safeEqual(fromCookie, expected)) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  return new NextResponse(null, { status: 404 });
}

export const config = { matcher: ["/team", "/team/:path*"] };
