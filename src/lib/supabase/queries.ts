import { createServiceClient } from "./server";
import { mapCandidat, mapDocument, mapPartenaire } from "./mappers";
import type { DashboardStats, DbProfile, DbRole } from "./types";
import type { Candidat, DocumentType, Partenaire, StatutCandidat } from "@/types";
import { PARCOURS_LABELS } from "@/types";

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
  return updateCandidatDb(id, patch);
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
