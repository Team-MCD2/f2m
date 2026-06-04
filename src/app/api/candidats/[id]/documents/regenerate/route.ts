import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { generateSingleDocumentForCandidat } from "@/lib/documents/generate-single";
import {
  deleteDocumentFichier,
  fetchDocumentFichierById,
} from "@/lib/supabase/queries";
import { DOCUMENT_LABELS, type DocumentType } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
    const { id } = await params;
    const body = await request.json();
    const { fichierId, type: typeParam } = body as {
      fichierId?: string;
      type?: string;
    };

    let docType: DocumentType | null = null;

    if (fichierId) {
      const doc = await fetchDocumentFichierById(fichierId);
      if (!doc || doc.candidatId !== id) {
        return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
      }
      if (!doc.templateType || !(doc.templateType in DOCUMENT_LABELS)) {
        return NextResponse.json(
          { error: "Ce document ne peut pas être régénéré." },
          { status: 400 }
        );
      }
      docType = doc.templateType as DocumentType;
      await deleteDocumentFichier(fichierId);
    } else if (typeParam && typeParam in DOCUMENT_LABELS) {
      docType = typeParam as DocumentType;
    } else {
      return NextResponse.json(
        { error: "fichierId ou type requis." },
        { status: 400 }
      );
    }

    const { fichier, candidat } = await generateSingleDocumentForCandidat(id, docType, {
      recordInDocumentsGeneres: false,
    });

    return NextResponse.json({ candidat, fichier });
  } catch (e) {
    console.error("regenerate document", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur régénération." },
      { status: 500 }
    );
  }
}
