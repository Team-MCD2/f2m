import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth/session";
import { redirectForRole } from "@/lib/auth/roles";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const profile = await getSessionProfile();
  if (!profile) {
    return NextResponse.json(
      { error: "Profil introuvable. Définissez publicMetadata.role dans Clerk." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    role: profile.role,
    redirect: redirectForRole(profile.role, profile.candidat_token),
    partenaireId: profile.partenaire_id,
    candidatToken: profile.candidat_token,
  });
}
