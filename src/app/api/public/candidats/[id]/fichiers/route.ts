import { NextResponse } from "next/server";
import { insertDocumentFichier, fetchCandidatById } from "@/lib/supabase/queries";
import { insertNotification } from "@/lib/supabase/notifications";
import { isAllowedMime, MAX_FILE_BYTES } from "@/lib/storage/detect";
import { uploadCandidatFile } from "@/lib/storage/upload-file";

/** Upload pièce jointe lors du dépôt public (avant connexion Clerk). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const form = await request.formData();
    const token = String(form.get("token") ?? "").trim().toLowerCase();
    const pieceId = String(form.get("pieceId") ?? "piece");
    const file = form.get("file");

    if (!token || !(file instanceof File)) {
      return NextResponse.json({ error: "Token et fichier requis." }, { status: 400 });
    }

    const candidat = await fetchCandidatById(id);
    if (!candidat || candidat.token !== token) {
      return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 20 Mo)." }, { status: 400 });
    }

    const mimeType = file.type || "application/octet-stream";
    const ext = file.name.toLowerCase();
    const extOk = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".doc", ".docx"].some((e) =>
      ext.endsWith(e)
    );
    if (!isAllowedMime(mimeType) && !extOk) {
      return NextResponse.json({ error: "Type de fichier non autorisé." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = `${pieceId}-${file.name}`;
    const uploaded = await uploadCandidatFile(id, safeName, buffer, mimeType);

    await insertDocumentFichier({
      candidatId: id,
      nomFichier: file.name,
      mimeType: uploaded.mimeType,
      tailleOctets: file.size,
      storage: uploaded.storage,
      storagePath: uploaded.storagePath,
      url: uploaded.url,
      source: "eleve",
      uploadedBy: "depot-public",
    });

    return NextResponse.json({ ok: true, pieceId });
  } catch (e) {
    console.error("public upload", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur upload." },
      { status: 500 }
    );
  }
}
