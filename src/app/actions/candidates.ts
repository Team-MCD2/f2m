"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getCandidaturePortalUrl } from "@/lib/candidature-url";
import { STORAGE_BUCKET } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CandidateStatus } from "@/types/database";

export async function updateCandidateStatus(
  candidateId: string,
  status: CandidateStatus,
) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("Non autorisé");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("candidates")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.email ?? admin.userId,
    })
    .eq("id", candidateId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/demandes");
  revalidatePath("/admin/acceptes");
  revalidatePath("/admin/refuses");
  revalidatePath(`/admin/candidats/${candidateId}`);
}

export async function updateCandidateAdminFields(
  candidateId: string,
  data: {
    notes?: string;
    numero_diplome?: string;
    numero_carte_vitale?: string;
    code_insee_commune?: string;
  },
) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("Non autorisé");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("candidates")
    .update(data)
    .eq("id", candidateId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/candidats/${candidateId}`);
  revalidatePath("/admin/export");
}

export async function createCandidatureLink() {
  const admin = await requireAdmin();
  if (!admin) throw new Error("Non autorisé");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("candidates")
    .insert({
      nom: "À compléter",
      prenom: "À compléter",
      telephone: "",
      status: "pending",
      parcours: "formation_continue",
    })
    .select("id, access_token")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Création impossible");

  const base = getCandidaturePortalUrl();
  return {
    id: data.id,
    url: `${base}/candidature/${data.access_token}`,
  };
}

export async function deleteCandidate(candidateId: string) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("Non autorisé");

  const supabase = createAdminClient();
  const { data: docs } = await supabase
    .from("candidate_documents")
    .select("storage_path")
    .eq("candidate_id", candidateId);

  if (docs?.length) {
    await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(docs.map((d) => d.storage_path));
  }

  const { error } = await supabase
    .from("candidates")
    .delete()
    .eq("id", candidateId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}
