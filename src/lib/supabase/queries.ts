import { createServiceClient } from "./server";
import { mapCandidat, mapDocument, mapDocumentFichier, mapPartenaire } from "./mappers";
import { generateAutoDocumentsForCandidat } from "@/lib/documents/auto-generate";
import { insertNotification } from "@/lib/supabase/notifications";
import { deleteFromCloudinary } from "@/lib/storage/cloudinary-upload";
import { deleteFromSupabaseStorage } from "@/lib/storage/supabase-upload";
import type { DocumentFichier, DocumentSource } from "@/types";
import type { DashboardStats, DbProfile, DbRole } from "./types";
import type { Candidat, DocumentType, Partenaire, StatutCandidat } from "@/types";
import { PARCOURS_LABELS, STATUT_LABELS } from "@/types";

const CANDIDAT_SELECT = `
  *,
  documents_generes (*)
`;

export async function fetchAllCandidats(): Promise<Candidat[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("candidats")
    .select(CANDIDAT_SELECT)
    .order("date_demande", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapCandidat(row));
}

export async function fetchCandidatById(id: string): Promise<Candidat | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("candidats")
    .select(CANDIDAT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCandidat(data) : null;
}

export async function fetchCandidatByToken(token: string): Promise<Candidat | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("candidats")
    .select(CANDIDAT_SELECT)
    .eq("token", token)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCandidat(data) : null;
}

export async function fetchCandidatsByPartenaire(partenaireId: string): Promise<Candidat[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("candidats")
    .select(CANDIDAT_SELECT)
    .eq("partenaire_id", partenaireId)
    .order("date_demande", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapCandidat(row));
}

export async function fetchPartenaireById(id: string): Promise<Partenaire | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("partenaires")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapPartenaire(data) : null;
}

export async function fetchPartenaireByEmail(email: string): Promise<Partenaire | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("partenaires")
    .select("*")
    .ilike("email", email)
    .maybeSingle();

  if (error) throw error;
  return data ? mapPartenaire(data) : null;
}

export async function getProfileByClerkId(clerkUserId: string): Promise<DbProfile | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertProfile(input: {
  clerk_user_id: string;
  role: DbRole;
  email?: string;
  partenaire_id?: string | null;
  candidat_token?: string | null;
}): Promise<DbProfile> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(input, { onConflict: "clerk_user_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertCandidat(row: Record<string, unknown>): Promise<Candidat> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("candidats")
    .insert(row)
    .select(CANDIDAT_SELECT)
    .single();

  if (error) throw error;
  return mapCandidat(data);
}

export async function updateCandidatDb(
  id: string,
  patch: Record<string, unknown>
): Promise<Candidat> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("candidats")
    .update(patch)
    .eq("id", id)
    .select(CANDIDAT_SELECT)
    .single();

  if (error) throw error;
  return mapCandidat(data);
}

export async function insertDocument(
  candidatId: string,
  type: DocumentType,
  nom: string
): Promise<Candidat> {
  const supabase = createServiceClient();
  const { error: docError } = await supabase.from("documents_generes").insert({
    candidat_id: candidatId,
    type,
    nom,
    genere_le: new Date().toISOString().split("T")[0],
  });

  if (docError) throw docError;

  const candidat = await fetchCandidatById(candidatId);
  if (!candidat) throw new Error("Candidat introuvable après ajout document");
  return candidat;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const candidats = await fetchAllCandidats();
  const total = candidats.length;
  const demande = candidats.filter((c) => c.statut === "demande").length;
  const accepte = candidats.filter((c) => c.statut === "accepte").length;
  const refuse = candidats.filter((c) => c.statut === "refuse").length;
  const enFormation = candidats.filter((c) => c.statut === "en_formation").length;
  const diplome = candidats.filter((c) => c.statut === "diplome").length;

  const moisMap = new Map<string, number>();
  candidats.forEach((c) => {
    const d = c.dateAcceptation || c.dateDemande;
    if (!d) return;
    const key = d.slice(0, 7);
    moisMap.set(key, (moisMap.get(key) ?? 0) + 1);
  });

  const parMois = Array.from(moisMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12)
    .map(([mois, count]) => ({
      mois: new Date(mois + "-01").toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      }),
      count,
    }));

  const parcoursMap = new Map<string, number>();
  candidats.forEach((c) => {
    const label = PARCOURS_LABELS[c.parcours];
    parcoursMap.set(label, (parcoursMap.get(label) ?? 0) + 1);
  });

  const parParcours = Array.from(parcoursMap.entries()).map(([parcours, count]) => ({
    parcours,
    count,
  }));

  return { total, demande, accepte, refuse, enFormation, diplome, parMois, parParcours };
}

export async function fetchDocumentsFichiers(candidatId: string): Promise<DocumentFichier[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("documents_fichiers")
    .select("*")
    .eq("candidat_id", candidatId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapDocumentFichier(row));
}

export async function insertDocumentFichier(input: {
  candidatId: string;
  nomFichier: string;
  mimeType: string;
  tailleOctets: number;
  storage: "supabase" | "cloudinary";
  storagePath: string;
  url: string;
  source: DocumentSource;
  templateType?: string;
  uploadedBy?: string;
}): Promise<DocumentFichier> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("documents_fichiers")
    .insert({
      candidat_id: input.candidatId,
      nom_fichier: input.nomFichier,
      mime_type: input.mimeType,
      taille_octets: input.tailleOctets,
      storage: input.storage,
      storage_path: input.storagePath,
      url: input.url,
      source: input.source,
      template_type: input.templateType ?? null,
      uploaded_by: input.uploadedBy ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapDocumentFichier(data);
}

export async function deleteDocumentFichier(id: string): Promise<DocumentFichier> {
  const supabase = createServiceClient();
  const { data: row, error: fetchErr } = await supabase
    .from("documents_fichiers")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !row) throw new Error("Document introuvable");

  if (row.storage === "supabase") {
    await deleteFromSupabaseStorage(row.storage_path);
  } else if (row.storage === "cloudinary") {
    await deleteFromCloudinary(row.storage_path);
  }

  const { error } = await supabase.from("documents_fichiers").delete().eq("id", id);
  if (error) throw error;
  return mapDocumentFichier(row);
}

export async function updateCandidatStatut(
  id: string,
  statut: StatutCandidat
): Promise<Candidat> {
  const existing = await fetchCandidatById(id);
  if (!existing) throw new Error("Candidat introuvable");

  const patch: Record<string, unknown> = { statut };
  if (statut === "accepte" && !existing.dateAcceptation) {
    patch.date_acceptation = new Date().toISOString().split("T")[0];
  }
  const updated = await updateCandidatDb(id, patch);

  if (statut !== existing.statut) {
    await insertNotification({
      candidatId: id,
      type: "statut",
      titre: "Mise à jour de votre dossier",
      message: `Votre dossier est maintenant : ${STATUT_LABELS[statut]}.`,
    });
  }

  if (statut === "accepte") {
    try {
      await generateAutoDocumentsForCandidat(id);
      await insertNotification({
        candidatId: id,
        type: "document",
        titre: "Documents F2M disponibles",
        message: "Vos documents officiels ont été générés et sont dans « Mes documents ».",
      });
    } catch (e) {
      console.error("Génération auto documents:", e);
    }
  }

  return updated;
}

export async function linkCandidatClerkUser(
  candidatId: string,
  clerkUserId: string
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("candidats")
    .update({ clerk_user_id: clerkUserId })
    .eq("id", candidatId);

  if (error) throw error;
}
