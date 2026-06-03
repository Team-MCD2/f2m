import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  getProfileByClerkId,
  upsertProfile,
  fetchPartenaireByEmail,
  fetchCandidatByEmail,
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

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  let metadataRole = roleFromMetadata(user.publicMetadata as Record<string, unknown>);

  // Si pas de rôle Clerk mais email = dossier candidat → forcer rôle candidat
  let candidatToken =
    typeof user.publicMetadata.candidat_token === "string"
      ? user.publicMetadata.candidat_token
      : null;

  if (!metadataRole && email) {
    const candidat = await fetchCandidatByEmail(email);
    if (candidat) {
      metadataRole = "candidat";
      candidatToken = candidat.token;
      await client.users.updateUser(userId, {
        publicMetadata: {
          role: "candidat",
          candidat_token: candidat.token,
        },
      });
    }
  }

  let profile = await getProfileByClerkId(userId);

  // Profil Supabase obsolète (ex. admin) alors que Clerk / dossier = candidat
  if (profile && metadataRole && profile.role !== metadataRole) {
    profile = await upsertProfile({
      clerk_user_id: userId,
      role: metadataRole,
      email: email ?? profile.email ?? undefined,
      partenaire_id: metadataRole === "partenaire" ? profile.partenaire_id : null,
      candidat_token: metadataRole === "candidat" ? candidatToken : null,
    });
    return profile;
  }

  if (profile) {
    if (profile.role === "candidat" && candidatToken && profile.candidat_token !== candidatToken) {
      profile = await upsertProfile({
        clerk_user_id: userId,
        role: "candidat",
        email: email ?? profile.email ?? undefined,
        candidat_token: candidatToken,
      });
    }
    return profile;
  }

  if (!metadataRole) return null;

  let partenaireId: string | null = null;
  const metaPartenaireId = user.publicMetadata.partenaire_id;
  if (typeof metaPartenaireId === "string") partenaireId = metaPartenaireId;

  if (metadataRole === "partenaire" && !partenaireId && email) {
    const partenaire = await fetchPartenaireByEmail(email);
    partenaireId = partenaire?.id ?? null;
  }

  profile = await upsertProfile({
    clerk_user_id: userId,
    role: metadataRole,
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
