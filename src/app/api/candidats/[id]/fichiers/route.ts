import { NextResponse } from "next/server";
import { assertCandidatAccess } from "@/lib/auth/candidat-access";
import { getSessionProfile, requireRole } from "@/lib/auth/session";
import {
  fetchDocumentsFichiers,
  insertDocumentFichier,
} from "@/lib/supabase/queries";
import { isAllowedMime, MAX_FILE_BYTES } from "@/lib/storage/detect";
import { insertNotification } from "@/lib/supabase/notifications";
import { uploadCandidatFile } from "@/lib/storage/upload-file";
import type { DocumentSource } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getSessionProfile();
    if (!profile) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const { id } = await params;
    await assertCandidatAccess(profile, id);
    const fichiers = await fetchDocumentsFichiers(id);
    return NextResponse.json(fichiers);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur";
    const status = msg.includes("autorisé") || msg.includes("introuvable") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await requireRole(["admin", "candidat"]);
    const { id } = await params;
    await assertCandidatAccess(profile, id);

    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 20 Mo)." },
        { status: 400 }
      );
    }

    const mimeType = file.type || "application/octet-stream";
    const ext = file.name.toLowerCase();
    const allowedExt = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".doc", ".docx"];
    const extOk = allowedExt.some((e) => ext.endsWith(e));
    if (!isAllowedMime(mimeType) && !extOk) {
      return NextResponse.json(
        { error: "Type non autorisé. Formats : PDF, images, Word." },
        { status: 400 }
      );
    }

    const source: DocumentSource = profile.role === "admin" ? "admin" : "eleve";
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadCandidatFile(id, file.name, buffer, mimeType);

    const doc = await insertDocumentFichier({
      candidatId: id,
      nomFichier: file.name,
      mimeType: uploaded.mimeType,
      tailleOctets: file.size,
      storage: uploaded.storage,
      storagePath: uploaded.storagePath,
      url: uploaded.url,
      source,
      uploadedBy: profile.clerk_user_id,
    });

    if (source === "admin") {
      await insertNotification({
        candidatId: id,
        type: "document",
        titre: "Nouveau document disponible",
        message: `L'administration a ajouté « ${file.name} » à votre espace.`,
      });
    }

    return NextResponse.json(doc, { status: 201 });
  } catch (e) {
    console.error("POST fichier", e);
    const msg = e instanceof Error ? e.message : "Erreur upload.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
