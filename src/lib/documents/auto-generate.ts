import { generateDocumentHtml } from "@/lib/documents";
import {
  fetchCandidatById,
  fetchDocumentsFichiers,
  insertDocumentFichier,
} from "@/lib/supabase/queries";
import { uploadCandidatFile } from "@/lib/storage/upload-file";
import { DOCUMENT_LABELS, type DocumentType } from "@/types";

const AUTO_TYPES: DocumentType[] = [
  "fiche_renseignement",
  "attestation_entree",
  "attestation_fin",
  "feuille_emargement",
];

/** Génère et stocke les documents F2M pour un élève (sans action de l'élève). */
export async function generateAutoDocumentsForCandidat(candidatId: string): Promise<void> {
  const candidat = await fetchCandidatById(candidatId);
  if (!candidat) return;

  const existing = await fetchDocumentsFichiers(candidatId);
  const existingTypes = new Set(
    existing.filter((d) => d.source === "auto_genere" && d.templateType).map((d) => d.templateType)
  );

  for (const type of AUTO_TYPES) {
    if (existingTypes.has(type)) continue;

    const html = generateDocumentHtml(candidat, type);
    const fileName = `${DOCUMENT_LABELS[type].replace(/\s+/g, "_")}.html`;
    const buffer = Buffer.from(html, "utf-8");

    const uploaded = await uploadCandidatFile(
      candidatId,
      fileName,
      buffer,
      "text/html; charset=utf-8"
    );

    await insertDocumentFichier({
      candidatId,
      nomFichier: fileName,
      mimeType: "text/html",
      tailleOctets: buffer.length,
      storage: uploaded.storage,
      storagePath: uploaded.storagePath,
      url: uploaded.url,
      source: "auto_genere",
      templateType: type,
      uploadedBy: "system",
    });
  }
}
