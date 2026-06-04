import { createAdminClient } from "@/lib/supabase/admin";
import type { Candidate, CandidateDocument, CandidateStatus } from "@/types/database";

export async function getCandidatesByStatus(
  status: CandidateStatus,
  options?: { onlySubmitted?: boolean },
) {
  const supabase = createAdminClient();
  let query = supabase.from("candidates").select("*").eq("status", status);

  if (options?.onlySubmitted) {
    query = query.not("submitted_at", "is", null);
  }

  const { data, error } = await query.order("submitted_at", {
    ascending: false,
    nullsFirst: false,
  });

  if (error) throw new Error(error.message);
  return (data ?? []) as Candidate[];
}

export async function getCandidateStats() {
  const supabase = createAdminClient();
  const statuses: CandidateStatus[] = ["pending", "accepted", "rejected"];
  const counts: Record<CandidateStatus, number> = {
    pending: 0,
    accepted: 0,
    rejected: 0,
  };

  for (const s of statuses) {
    let q = supabase
      .from("candidates")
      .select("*", { count: "exact", head: true })
      .eq("status", s);
    if (s === "pending") {
      q = q.not("submitted_at", "is", null);
    }
    const { count } = await q;
    counts[s] = count ?? 0;
  }

  return counts;
}

export async function getCandidateById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Candidate;
}

export async function getCandidateDocuments(candidateId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("candidate_documents")
    .select("*")
    .eq("candidate_id", candidateId);

  if (error) throw new Error(error.message);
  return (data ?? []) as CandidateDocument[];
}
