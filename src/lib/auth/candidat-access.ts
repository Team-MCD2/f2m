import { fetchCandidatById } from "@/lib/supabase/queries";
import type { DbProfile } from "@/lib/supabase/types";

export async function assertCandidatAccess(
  profile: DbProfile,
  candidatId: string
): Promise<void> {
  if (profile.role === "admin") return;

  const candidat = await fetchCandidatById(candidatId);
  if (!candidat) throw new Error("Candidat introuvable");

  if (candidat.banni) {
    throw new Error("Compte suspendu");
  }

  if (profile.role === "candidat") {
    if (profile.candidat_token && candidat.token === profile.candidat_token) return;
    throw new Error("Accès non autorisé");
  }

  if (profile.role === "partenaire" && profile.partenaire_id) {
    if (candidat.partenaireId === profile.partenaire_id) return;
    throw new Error("Accès non autorisé");
  }

  throw new Error("Accès non autorisé");
}
