import { NextResponse } from "next/server";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  PARTENAIRE_EMAIL,
  PARTENAIRE_PASSWORD,
  ROLE_COOKIE,
  SESSION_MAX_AGE,
  TOKEN_COOKIE,
  type UserRole,
} from "@/lib/auth";

function setRoleCookie(response: NextResponse, role: UserRole) {
  response.cookies.set(ROLE_COOKIE, role, {
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const role = body.role as UserRole;

  if (role === "admin") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "E-mail ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ redirect: "/admin" });
    setRoleCookie(response, "admin");
    response.cookies.delete(TOKEN_COOKIE);
    return response;
  }

  if (role === "candidat") {
    const token = String(body.token ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (!token || !/^[a-z0-9-]+$/.test(token)) {
      return NextResponse.json(
        { error: "Identifiant personnel invalide (ex. jean-dupont)." },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ redirect: `/candidat/${token}` });
    setRoleCookie(response, "candidat");
    response.cookies.set(TOKEN_COOKIE, token, {
      path: "/",
      maxAge: SESSION_MAX_AGE,
      sameSite: "lax",
      httpOnly: true,
    });
    return response;
  }

  if (role === "partenaire") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (
      email !== PARTENAIRE_EMAIL.toLowerCase() ||
      password !== PARTENAIRE_PASSWORD
    ) {
      return NextResponse.json(
        { error: "E-mail ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ redirect: "/partenaire" });
    setRoleCookie(response, "partenaire");
    response.cookies.delete(TOKEN_COOKIE);
    return response;
  }

  return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
}
