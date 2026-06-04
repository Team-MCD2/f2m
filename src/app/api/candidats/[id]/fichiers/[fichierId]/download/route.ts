import { NextResponse } from "next/server";
import { assertCandidatAccess } from "@/lib/auth/candidat-access";
import { getSessionProfile } from "@/lib/auth/session";
import { fetchDocumentFichierById } from "@/lib/supabase/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; fichierId: string }> }
) {
  try {
    const profile = await getSessionProfile();
    if (!profile) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id, fichierId } = await params;
    await assertCandidatAccess(profile, id);

    const doc = await fetchDocumentFichierById(fichierId);
    if (!doc || doc.candidatId !== id) {
      return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
    }

    if (
      profile.role === "candidat" &&
      doc.source !== "eleve" &&
      doc.statutEnvoi !== "envoye"
    ) {
      return NextResponse.json({ error: "Document non disponible." }, { status: 403 });
    }

    const upstream = await fetch(doc.url);
    if (!upstream.ok) {
      return NextResponse.json({ error: "Fichier inaccessible." }, { status: 502 });
    }

    const buffer = await upstream.arrayBuffer();
    const safeName = doc.nomFichier.replace(/[^\w.\-àâäéèêëïîôùûüç\s]/gi, "_");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": `attachment; filename="${safeName}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur téléchargement.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
