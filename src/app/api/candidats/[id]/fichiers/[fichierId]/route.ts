import { NextResponse } from "next/server";
import { assertCandidatAccess } from "@/lib/auth/candidat-access";
import { getSessionProfile } from "@/lib/auth/session";
import { deleteDocumentFichier, fetchDocumentsFichiers } from "@/lib/supabase/queries";

export async function DELETE(
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

    const fichiers = await fetchDocumentsFichiers(id);
    const doc = fichiers.find((f) => f.id === fichierId);
    if (!doc) {
      return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
    }

    if (profile.role === "candidat" && doc.source !== "eleve") {
      return NextResponse.json(
        { error: "Vous ne pouvez supprimer que vos propres documents." },
        { status: 403 }
      );
    }

    if (profile.role !== "admin" && profile.role !== "candidat") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await deleteDocumentFichier(fichierId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
