import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("dbvault_session")?.value;
  const isAuthenticated = sessionToken === "authenticated_divyansh_session";
  const { pathname } = request.nextUrl;

  // Public paths allowed without auth
  const isPublicPath = pathname === "/login";

  // Ignore static assets, api routes, icons
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If user is trying to access login page while authenticated -> redirect to home
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is trying to access protected vault page while NOT authenticated -> redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
