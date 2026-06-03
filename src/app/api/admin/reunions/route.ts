import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { fetchAllLiensReunion, upsertLienReunion } from "@/lib/supabase/liens-reunion";
import type { ParcoursType } from "@/types";
import { PARCOURS_LABELS } from "@/types";

export async function GET() {
  try {
    await requireRole(["admin"]);
    const liens = await fetchAllLiensReunion();
    return NextResponse.json(
      liens.map((l) => ({
        ...l,
        label: PARCOURS_LABELS[l.parcours],
      }))
    );
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireRole(["admin"]);
    const body = await request.json();
    const parcours = body.parcours as ParcoursType;
    if (!parcours || !(parcours in PARCOURS_LABELS)) {
      return NextResponse.json({ error: "Parcours invalide." }, { status: 400 });
    }

    const updated = await upsertLienReunion(
      parcours,
      String(body.teamsUrl ?? ""),
      String(body.elearningUrl ?? "")
    );

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur" },
      { status: 500 }
    );
  }
}
