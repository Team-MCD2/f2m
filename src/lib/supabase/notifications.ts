import { createServiceClient } from "./server";

export type NotificationType = "document" | "statut" | "relance" | "info";

export interface DbNotification {
  id: string;
  candidat_id: string;
  type: NotificationType;
  titre: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export async function insertNotification(input: {
  candidatId: string;
  type: NotificationType;
  titre: string;
  message: string;
}): Promise<DbNotification> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      candidat_id: input.candidatId,
      type: input.type,
      titre: input.titre,
      message: input.message,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DbNotification;
}

export async function fetchNotifications(
  candidatId: string,
  since?: string
): Promise<DbNotification[]> {
  const supabase = createServiceClient();
  let q = supabase
    .from("notifications")
    .select("*")
    .eq("candidat_id", candidatId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (since) q = q.gt("created_at", since);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as DbNotification[];
}

export async function markNotificationsRead(candidatId: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("notifications")
    .update({ lu: true })
    .eq("candidat_id", candidatId)
    .eq("lu", false);
}

export async function insertRelance(input: {
  candidatId: string;
  message: string;
  emailEnvoye: boolean;
  envoyePar?: string;
}): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("relances").insert({
    candidat_id: input.candidatId,
    message: input.message,
    email_envoye: input.emailEnvoye,
    envoye_par: input.envoyePar ?? null,
  });
  if (error) throw error;
}
