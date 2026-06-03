import { createServiceClient } from "./server";

export interface AdminNotification {
  id: string;
  type: string;
  titre: string;
  message: string;
  candidatId?: string;
  lu: boolean;
  createdAt: string;
}

export async function insertAdminNotification(input: {
  type: string;
  titre: string;
  message: string;
  candidatId?: string;
}): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("admin_notifications").insert({
    type: input.type,
    titre: input.titre,
    message: input.message,
    candidat_id: input.candidatId ?? null,
  });
  if (error) throw error;
}

export async function fetchAdminNotifications(since?: string): Promise<AdminNotification[]> {
  const supabase = createServiceClient();
  let q = supabase
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(40);

  if (since) q = q.gt("created_at", since);

  const { data, error } = await q;
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    type: row.type,
    titre: row.titre,
    message: row.message,
    candidatId: row.candidat_id ?? undefined,
    lu: row.lu,
    createdAt: row.created_at,
  }));
}

export async function markAdminNotificationsRead(): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from("admin_notifications").update({ lu: true }).eq("lu", false);
}

export async function countUnreadAdminNotifications(): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("lu", false);

  if (error) throw error;
  return count ?? 0;
}
