import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** Connexion candidat par identifiant personnel (token) — ticket Clerk */
export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const normalized = String(token ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (!normalized || !/^[a-z0-9-]+$/.test(normalized)) {
      return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: dbRow, error } = await supabase
      .from("candidats")
      .select("id, clerk_user_id, token")
      .eq("token", normalized)
      .maybeSingle();

    if (error) throw error;
    const row = dbRow as { id: string; clerk_user_id: string | null; token: string } | null;
    if (!row) {
      return NextResponse.json(
        { error: "Aucun dossier trouvé pour cet identifiant." },
        { status: 404 }
      );
    }

    if (!row.clerk_user_id) {
      return NextResponse.json(
        {
          error:
            "Compte candidat non activé. Contactez F2M après soumission de votre dossier.",
        },
        { status: 403 }
      );
    }

    const clerk = await clerkClient();
    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: row.clerk_user_id,
      expiresInSeconds: 120,
    });

    return NextResponse.json({
      ticket: signInToken.token,
      redirect: `/candidat/${normalized}`,
    });
  } catch (e) {
    console.error("candidat-ticket", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
