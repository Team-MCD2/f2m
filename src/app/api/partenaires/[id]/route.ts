import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { fetchPartenaireById } from "@/lib/supabase/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
    const { id } = await params;
    const partenaire = await fetchPartenaireById(id);
    if (!partenaire) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json(partenaire);
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}
