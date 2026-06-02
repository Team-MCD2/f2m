import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  fetchAllCandidats,
  fetchCandidatsByPartenaire,
  insertCandidat,
} from "@/lib/supabase/queries";
import { candidatToDbInsert } from "@/lib/supabase/mappers";
import type { Candidat } from "@/types";

export async function GET() {
  try {
    const profile = await requireRole(["admin", "partenaire"]);

    if (profile.role === "admin") {
      const candidats = await fetchAllCandidats();
      return NextResponse.json(candidats);
    }

    if (!profile.partenaire_id) {
      return NextResponse.json({ error: "Partenaire non associé au profil." }, { status: 403 });
    }

    const candidats = await fetchCandidatsByPartenaire(profile.partenaire_id);
    return NextResponse.json(candidats);
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const profile = await requireRole(["admin", "partenaire"]);
    const body = (await request.json()) as Candidat;

    if (!body.nom || !body.prenom || !body.email || !body.token) {
      return NextResponse.json({ error: "Données incomplètes." }, { status: 400 });
    }

    if (profile.role === "partenaire" && profile.partenaire_id) {
      body.partenaireId = profile.partenaire_id;
    }

    body.statut = body.statut ?? "demande";
    const row = candidatToDbInsert(body);
    const created = await insertCandidat(row);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST candidats", e);
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  }
}
