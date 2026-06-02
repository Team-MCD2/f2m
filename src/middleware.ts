import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_COOKIE, TOKEN_COOKIE } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      const url = new URL("/connexion", request.url);
      url.searchParams.set("role", "admin");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/partenaire")) {
    if (role !== "partenaire") {
      const url = new URL("/connexion", request.url);
      url.searchParams.set("role", "partenaire");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const candidatMatch = pathname.match(/^\/candidat\/([^/]+)/);
  if (candidatMatch) {
    const pathToken = candidatMatch[1];
    if (role !== "candidat" || token !== pathToken) {
      const url = new URL("/connexion", request.url);
      url.searchParams.set("role", "candidat");
      if (pathToken) url.searchParams.set("token", pathToken);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/partenaire", "/partenaire/:path*", "/candidat/:path*"],
};
