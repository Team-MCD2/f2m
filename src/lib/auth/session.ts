import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  getProfileByClerkId,
  upsertProfile,
  fetchPartenaireByEmail,
} from "@/lib/supabase/queries";
import type { DbProfile, DbRole } from "@/lib/supabase/types";
import { roleFromMetadata } from "./roles";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) return null;
  return userId;
}

export async function getSessionProfile(): Promise<DbProfile | null> {
  const userId = await requireAuth();
  if (!userId) return null;

  let profile = await getProfileByClerkId(userId);
  if (profile) return profile;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = roleFromMetadata(user.publicMetadata as Record<string, unknown>);
  if (!role) return null;

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  let partenaireId: string | null = null;
  const metaPartenaireId = user.publicMetadata.partenaire_id;
  if (typeof metaPartenaireId === "string") partenaireId = metaPartenaireId;

  if (role === "partenaire" && !partenaireId && email) {
    const partenaire = await fetchPartenaireByEmail(email);
    partenaireId = partenaire?.id ?? null;
  }

  const candidatToken =
    typeof user.publicMetadata.candidat_token === "string"
      ? user.publicMetadata.candidat_token
      : null;

  profile = await upsertProfile({
    clerk_user_id: userId,
    role,
    email: email ?? undefined,
    partenaire_id: partenaireId,
    candidat_token: candidatToken,
  });

  return profile;
}

export async function requireRole(allowed: DbRole[]): Promise<DbProfile> {
  const profile = await getSessionProfile();
  if (!profile || !allowed.includes(profile.role)) {
    throw new Error("Accès non autorisé");
  }
  return profile;
}
