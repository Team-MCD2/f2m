import { generateDocumentHtml } from "@/lib/documents";
import {
  fetchCandidatById,
  insertDocument,
  insertDocumentFichier,
} from "@/lib/supabase/queries";
import { uploadCandidatFile } from "@/lib/storage/upload-file";
import { DOCUMENT_LABELS, type DocumentFichier, type DocumentType } from "@/types";

export async function generateSingleDocumentForCandidat(
  candidatId: string,
  type: DocumentType,
  options?: { recordInDocumentsGeneres?: boolean }
): Promise<{ fichier: DocumentFichier; candidat: Awaited<ReturnType<typeof fetchCandidatById>> }> {
  const candidat = await fetchCandidatById(candidatId);
  if (!candidat) {
    throw new Error("Candidat introuvable.");
  }

  if (options?.recordInDocumentsGeneres !== false) {
    await insertDocument(candidatId, type, DOCUMENT_LABELS[type]);
  }

  const html = generateDocumentHtml(candidat, type);
  const fileName = `${DOCUMENT_LABELS[type].replace(/\s+/g, "_")}.html`;
  const buffer = Buffer.from(html, "utf-8");
  const uploaded = await uploadCandidatFile(candidatId, fileName, buffer, "text/html");

  const fichier = await insertDocumentFichier({
    candidatId,
    nomFichier: fileName,
    mimeType: "text/html",
    tailleOctets: buffer.length,
    storage: uploaded.storage,
    storagePath: uploaded.storagePath,
    url: uploaded.url,
    source: "auto_genere",
    templateType: type,
    uploadedBy: "admin",
  });

  const updated = await fetchCandidatById(candidatId);
  return { fichier, candidat: updated };
}
