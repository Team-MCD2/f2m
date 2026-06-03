import { NextResponse } from "next/server";
import {
  canActivateAccount,
  findCandidatByEmailOrToken,
} from "@/lib/auth/candidat-password";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();
    if (!email && !token) {
      return NextResponse.json({ error: "Email ou identifiant requis." }, { status: 400 });
    }

    const row = await findCandidatByEmailOrToken(
      email ? String(email) : undefined,
      token ? String(token) : undefined
    );

    if (!row) {
      return NextResponse.json({ found: false });
    }

    if (row.banni) {
      return NextResponse.json({
        found: true,
        error: "Compte suspendu. Contactez F2M.",
      });
    }

    const statut = row.statut as string;
    const canActivate = canActivateAccount(statut);

    return NextResponse.json({
      found: true,
      candidatId: row.id,
      email: row.email,
      token: row.token,
      prenom: row.prenom,
      nom: row.nom,
      statut,
      canActivate,
      motDePasseDefini: row.mot_de_passe_defini ?? false,
      message: !canActivate
        ? "Votre dossier n'est pas encore accepté. Vous recevrez un email dès la décision."
        : undefined,
    });
  } catch (e) {
    console.error("candidat-lookup", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
