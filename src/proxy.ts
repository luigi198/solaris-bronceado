import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_LOGIN_PATH, SESSION_COOKIE } from "@/lib/http/sessionCookie";

/**
 * Optimistic gate for /admin: bounce requests without a session cookie before
 * rendering anything. It does NOT validate the session — requireAdmin() does
 * that in every page and Server Action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === ADMIN_LOGIN_PATH) return NextResponse.next();
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
