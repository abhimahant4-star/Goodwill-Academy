import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIES, verifySessionToken, type Role } from "@/lib/auth";

/** First line of defence: a valid signed cookie for the right role. Pages and actions re-check in full. */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role: Role = pathname.startsWith("/teacher") ? "teacher" : "admin";
  const loginPath = `/${role}/login`;
  if (pathname === loginPath) return NextResponse.next();

  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIES[role])?.value, role);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*"],
};
