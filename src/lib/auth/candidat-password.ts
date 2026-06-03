import { clerkClient } from "@clerk/nextjs/server";
import { formatClerkError } from "@/lib/auth/clerk-errors";
import { fetchCandidatById, updateCandidatDb } from "@/lib/supabase/queries";
import { createServiceClient } from "@/lib/supabase/server";
import { upsertProfile } from "@/lib/supabase/queries";

export function generatePassword(): string {
  const part = Math.random().toString(36).slice(2, 8);
  return `F2m-${part}!9`;
}

export async function findCandidatByEmailOrToken(email?: string, token?: string) {
  const supabase = createServiceClient();
  if (token) {
    const normalized = token.trim().toLowerCase().replace(/\s+/g, "-");
    const { data } = await supabase
      .from("candidats")
      .select("*")
      .eq("token", normalized)
      .maybeSingle();
    if (data) return data;
  }
  if (email) {
    const { data } = await supabase
      .from("candidats")
      .select("*")
      .ilike("email", email.trim())
      .maybeSingle();
    if (data) return data;
  }
  return null;
}

async function findClerkUserIdByEmail(email: string): Promise<string | null> {
  const clerk = await clerkClient();
  const list = await clerk.users.getUserList({ emailAddress: [email.trim()] });
  return list.data[0]?.id ?? null;
}

export async function ensureClerkUserForCandidat(candidatId: string): Promise<string> {
  const candidat = await fetchCandidatById(candidatId);
  if (!candidat) throw new Error("Candidat introuvable");

  if (candidat.clerkUserId) return candidat.clerkUserId;

  const clerk = await clerkClient();

  try {
    const user = await clerk.users.createUser({
      emailAddress: [candidat.email],
      skipPasswordRequirement: true,
      publicMetadata: {
        role: "candidat",
        candidat_token: candidat.token,
      },
    });

    await updateCandidatDb(candidatId, { clerk_user_id: user.id });
    await upsertProfile({
      clerk_user_id: user.id,
      role: "candidat",
      email: candidat.email,
      candidat_token: candidat.token,
    });

    return user.id;
  } catch (createErr) {
    const existingId = await findClerkUserIdByEmail(candidat.email);
    if (!existingId) throw createErr;

    await updateCandidatDb(candidatId, { clerk_user_id: existingId });
    await upsertProfile({
      clerk_user_id: existingId,
      role: "candidat",
      email: candidat.email,
      candidat_token: candidat.token,
    });

    return existingId;
  }
}

export async function setCandidatPassword(
  candidatId: string,
  password: string
): Promise<void> {
  if (password.length < 8) {
    throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
  }

  const clerkUserId = await ensureClerkUserForCandidat(candidatId);
  const clerk = await clerkClient();

  try {
    await clerk.users.updateUser(clerkUserId, {
      password,
      skipPasswordChecks: true,
    });
  } catch (e) {
    try {
      await clerk.users.updateUser(clerkUserId, { password });
    } catch (e2) {
      throw new Error(formatClerkError(e2));
    }
  }

  await updateCandidatDb(candidatId, {
    mot_de_passe_defini: true,
  });
}

export async function regenerateAndEmailPassword(candidatId: string): Promise<string> {
  const candidat = await fetchCandidatById(candidatId);
  if (!candidat) throw new Error("Candidat introuvable");

  const password = generatePassword();
  await setCandidatPassword(candidatId, password);

  const { getAppUrl } = await import("@/lib/app-url");
  const appUrl = getAppUrl();
  const { sendMail } = await import("@/lib/email/send-mail");
  const { motDePasseEmailHtml } = await import("@/lib/email/templates");

  await sendMail(
    candidat.email,
    "F2M Consulting — Votre nouveau mot de passe",
    motDePasseEmailHtml(candidat.prenom, candidat.nom, candidat.email, password, appUrl)
  );

  return password;
}

export function canActivateAccount(statut: string): boolean {
  return statut === "accepte" || statut === "en_formation" || statut === "diplome";
}
