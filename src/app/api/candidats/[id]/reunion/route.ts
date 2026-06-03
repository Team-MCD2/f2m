import { NextResponse } from "next/server";
import { assertCandidatAccess } from "@/lib/auth/candidat-access";
import { getSessionProfile } from "@/lib/auth/session";
import { fetchCandidatById } from "@/lib/supabase/queries";
import { fetchLienReunionByParcours } from "@/lib/supabase/liens-reunion";
import { PARCOURS_LABELS } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getSessionProfile();
    if (!profile) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const { id } = await params;
    await assertCandidatAccess(profile, id);

    const candidat = await fetchCandidatById(id);
    if (!candidat) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    const lien = await fetchLienReunionByParcours(candidat.parcours);

    return NextResponse.json({
      parcours: candidat.parcours,
      parcoursLabel: PARCOURS_LABELS[candidat.parcours],
      statut: candidat.statut,
      teamsUrl: lien?.teamsUrl ?? "",
      elearningUrl: lien?.elearningUrl ?? "",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur";
    const status = msg.includes("autorisé") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
