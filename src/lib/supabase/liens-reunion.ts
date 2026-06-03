import { createServiceClient } from "./server";
import type { ParcoursType } from "@/types";

export interface LienReunion {
  parcours: ParcoursType;
  teamsUrl: string;
  elearningUrl: string;
  updatedAt: string;
}

export async function fetchAllLiensReunion(): Promise<LienReunion[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("liens_reunion").select("*").order("parcours");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    parcours: row.parcours as ParcoursType,
    teamsUrl: row.teams_url ?? "",
    elearningUrl: row.elearning_url ?? "",
    updatedAt: row.updated_at,
  }));
}

export async function fetchLienReunionByParcours(
  parcours: ParcoursType
): Promise<LienReunion | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("liens_reunion")
    .select("*")
    .eq("parcours", parcours)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    parcours: data.parcours as ParcoursType,
    teamsUrl: data.teams_url ?? "",
    elearningUrl: data.elearning_url ?? "",
    updatedAt: data.updated_at,
  };
}

export async function upsertLienReunion(
  parcours: ParcoursType,
  teamsUrl: string,
  elearningUrl: string
): Promise<LienReunion> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("liens_reunion")
    .upsert(
      {
        parcours,
        teams_url: teamsUrl,
        elearning_url: elearningUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "parcours" }
    )
    .select()
    .single();

  if (error) throw error;
  return {
    parcours: data.parcours as ParcoursType,
    teamsUrl: data.teams_url,
    elearningUrl: data.elearning_url,
    updatedAt: data.updated_at,
  };
}
