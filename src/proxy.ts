import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "tranhaus_session";
const LOGIN_PATH = "/dashboard/login";

export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(COOKIE_NAME);
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN_PATH) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/dashboard/propiedades", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSessionCookie) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
