import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  fetchCandidatById,
  updateCandidatDb,
  updateCandidatStatut,
} from "@/lib/supabase/queries";
import type { StatutCandidat } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin", "partenaire", "candidat"]);
    const { id } = await params;
    const candidat = await fetchCandidatById(id);
    if (!candidat) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json(candidat);
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await requireRole(["admin", "partenaire", "candidat"]);
    const { id } = await params;
    const body = await request.json();

    if (profile.role === "candidat" && profile.candidat_token) {
      const existing = await fetchCandidatById(id);
      if (!existing || existing.token !== profile.candidat_token) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }
    }

    if (body.statut) {
      const updated = await updateCandidatStatut(id, body.statut as StatutCandidat);
      return NextResponse.json(updated);
    }

    const patch: Record<string, unknown> = {};
    if (body.numeroDiplome !== undefined) patch.numero_diplome = body.numeroDiplome;
    if (body.liens !== undefined) patch.liens = body.liens;
    if (body.notes !== undefined) patch.notes = body.notes;
    if (body.numeroCarteVitale !== undefined) patch.numero_carte_vitale = body.numeroCarteVitale;
    if (body.codeInsee !== undefined) patch.code_insee = body.codeInsee;

    const updated = await updateCandidatDb(id, patch);
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH candidat", e);
    return NextResponse.json({ error: "Erreur mise à jour." }, { status: 500 });
  }
}
