import type { DbRole } from "@/lib/supabase/types";

export type UserRole = DbRole;

export function redirectForRole(role: UserRole, candidatToken?: string | null): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "partenaire":
      return "/partenaire";
    case "candidat":
      return candidatToken ? `/candidat/${candidatToken}` : "/connexion?role=candidat";
    default:
      return "/connexion";
  }
}

export function roleFromMetadata(meta: Record<string, unknown> | undefined): UserRole | null {
  const role = meta?.role;
  if (role === "admin" || role === "candidat" || role === "partenaire") return role;
  return null;
}
