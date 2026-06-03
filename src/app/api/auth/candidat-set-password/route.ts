import { NextResponse } from "next/server";
import {
  canActivateAccount,
  findCandidatByEmailOrToken,
  setCandidatPassword,
} from "@/lib/auth/candidat-password";

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    if (!password || String(password).length < 8) {
      return NextResponse.json(
        { error: "Mot de passe requis (8 caractères minimum)." },
        { status: 400 }
      );
    }

    const row = await findCandidatByEmailOrToken(
      email ? String(email) : undefined,
      token ? String(token) : undefined
    );

    if (!row) {
      return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
    }

    if (row.banni) {
      return NextResponse.json({ error: "Compte suspendu." }, { status: 403 });
    }

    if (!canActivateAccount(row.statut)) {
      return NextResponse.json(
        { error: "Activation possible uniquement après acceptation du dossier." },
        { status: 403 }
      );
    }

    await setCandidatPassword(row.id, String(password));

    return NextResponse.json({
      ok: true,
      redirect: `/candidat/${row.token}`,
      message: "Mot de passe enregistré. Connectez-vous avec votre email.",
    });
  } catch (e) {
    console.error("candidat-set-password", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur" },
      { status: 500 }
    );
  }
}
