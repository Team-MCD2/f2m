import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/connexion(.*)",
  "/deposer-dossier",
  "/api/public(.*)",
  "/api/auth/candidat-ticket",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, sessionClaims } = await auth();
  if (!userId) {
    const url = new URL("/connexion", req.url);
    if (req.nextUrl.pathname.startsWith("/admin")) url.searchParams.set("role", "admin");
    if (req.nextUrl.pathname.startsWith("/partenaire")) url.searchParams.set("role", "partenaire");
    const candidatMatch = req.nextUrl.pathname.match(/^\/candidat\/([^/]+)/);
    if (candidatMatch) {
      url.searchParams.set("role", "candidat");
      url.searchParams.set("token", candidatMatch[1]);
    }
    return NextResponse.redirect(url);
  }

  const meta = sessionClaims?.metadata as Record<string, unknown> | undefined;
  const role = meta?.role as string | undefined;
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/connexion?role=admin", req.url));
  }

  if (pathname.startsWith("/partenaire") && role !== "partenaire") {
    return NextResponse.redirect(new URL("/connexion?role=partenaire", req.url));
  }

  const candidatMatch = pathname.match(/^\/candidat\/([^/]+)/);
  if (candidatMatch) {
    const pathToken = candidatMatch[1];
    const metaToken = meta?.candidat_token as string | undefined;
    if (role !== "candidat" || (metaToken && metaToken !== pathToken)) {
      const url = new URL("/connexion", req.url);
      url.searchParams.set("role", "candidat");
      url.searchParams.set("token", pathToken);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
