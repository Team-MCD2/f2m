import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { generateSingleDocumentForCandidat } from "@/lib/documents/generate-single";
import { DOCUMENT_LABELS, type DocumentType } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
    const { id } = await params;
    const { type } = await request.json();

    if (!type || !(type in DOCUMENT_LABELS)) {
      return NextResponse.json({ error: "Type invalide." }, { status: 400 });
    }

    const { fichier, candidat } = await generateSingleDocumentForCandidat(
      id,
      type as DocumentType
    );

    return NextResponse.json({ candidat, fichier });
  } catch (e) {
    console.error("generate document", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur génération." },
      { status: 500 }
    );
  }
}
