import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { fetchPartenaireById } from "@/lib/supabase/queries";

export async function GET() {
  try {
    const profile = await requireRole(["partenaire"]);
    if (!profile.partenaire_id) {
      return NextResponse.json({ error: "Partenaire non configuré." }, { status: 403 });
    }
    const partenaire = await fetchPartenaireById(profile.partenaire_id);
    if (!partenaire) {
      return NextResponse.json({ error: "Partenaire introuvable." }, { status: 404 });
    }
    return NextResponse.json(partenaire);
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}
