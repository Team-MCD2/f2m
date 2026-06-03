import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { generateDocumentHtml } from "@/lib/documents";
import {
  fetchCandidatById,
  insertDocument,
  insertDocumentFichier,
} from "@/lib/supabase/queries";
import { uploadCandidatFile } from "@/lib/storage/upload-file";
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

    const candidat = await fetchCandidatById(id);
    if (!candidat) {
      return NextResponse.json({ error: "Candidat introuvable." }, { status: 404 });
    }

    const docType = type as DocumentType;
    await insertDocument(id, docType, DOCUMENT_LABELS[docType]);

    const html = generateDocumentHtml(candidat, docType);
    const fileName = `${DOCUMENT_LABELS[docType].replace(/\s+/g, "_")}.html`;
    const buffer = Buffer.from(html, "utf-8");
    const uploaded = await uploadCandidatFile(id, fileName, buffer, "text/html");

    const fichier = await insertDocumentFichier({
      candidatId: id,
      nomFichier: fileName,
      mimeType: "text/html",
      tailleOctets: buffer.length,
      storage: uploaded.storage,
      storagePath: uploaded.storagePath,
      url: uploaded.url,
      source: "auto_genere",
      templateType: docType,
      uploadedBy: "admin",
    });

    const updated = await fetchCandidatById(id);
    return NextResponse.json({ candidat: updated, fichier });
  } catch (e) {
    console.error("generate document", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur génération." },
      { status: 500 }
    );
  }
}
