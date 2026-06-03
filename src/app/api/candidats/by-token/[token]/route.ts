import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth/session";
import { fetchCandidatByToken } from "@/lib/supabase/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const profile = await getSessionProfile();
    if (!profile) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { token } = await params;
    const candidat = await fetchCandidatByToken(token);
    if (!candidat) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    if (
      profile.role === "candidat" &&
      profile.candidat_token &&
      profile.candidat_token !== token
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    return NextResponse.json(candidat);
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
