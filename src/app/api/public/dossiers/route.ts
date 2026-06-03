import { NextResponse } from "next/server";
import { insertCandidat, fetchCandidatByEmail, fetchCandidatByToken } from "@/lib/supabase/queries";
import { candidatToDbInsert } from "@/lib/supabase/mappers";
import type { Candidat } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";
import { upsertProfile } from "@/lib/supabase/queries";
import { insertNotification } from "@/lib/supabase/notifications";
import { insertAdminNotification } from "@/lib/supabase/admin-notifications";
import { createTokenFromName } from "@/lib/utils";

function isDuplicateKeyError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const err = e as { code?: string; message?: string };
  return err.code === "23505" || /duplicate|unique/i.test(err.message ?? "");
}

/** Dépôt de dossier sans connexion (première demande) */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Candidat;

    if (!body.nom || !body.prenom || !body.email || !body.token) {
      return NextResponse.json({ error: "Données incomplètes." }, { status: 400 });
    }

    const token =
      body.token.trim().toLowerCase() ||
      createTokenFromName(body.prenom, body.nom);

    const byEmail = await fetchCandidatByEmail(body.email);
    if (byEmail) {
      return NextResponse.json(
        {
          code: "duplicate",
          error:
            "Un dossier existe déjà avec cet email. Utilisez la connexion ou complétez votre dossier existant.",
          candidat: byEmail,
        },
        { status: 409 }
      );
    }

    const byToken = await fetchCandidatByToken(token);
    if (byToken) {
      return NextResponse.json(
        {
          code: "duplicate",
          error:
            "Un dossier existe déjà pour cet identifiant (prénom-nom). Connectez-vous avec votre email.",
          candidat: byToken,
        },
        { status: 409 }
      );
    }

    body.statut = "demande";
    body.token = token;
    const row = candidatToDbInsert(body);
    const created = await insertCandidat(row);

    try {
      const clerk = await clerkClient();
      const user = await clerk.users.createUser({
        emailAddress: [body.email],
        skipPasswordRequirement: true,
        publicMetadata: {
          role: "candidat",
          candidat_token: token,
        },
      });

      const { createServiceClient } = await import("@/lib/supabase/server");
      const supabase = createServiceClient();
      await supabase
        .from("candidats")
        .update({ clerk_user_id: user.id })
        .eq("id", created.id);

      await upsertProfile({
        clerk_user_id: user.id,
        role: "candidat",
        email: body.email,
        candidat_token: token,
      });
    } catch (clerkErr) {
      console.warn("Clerk user creation:", clerkErr);
    }

    try {
      await insertNotification({
        candidatId: created.id,
        type: "info",
        titre: "Dossier en cours de traitement",
        message:
          "Votre demande a bien été reçue. Vous serez notifié ici dès qu'il y a du nouveau.",
      });
    } catch (e) {
      console.error("Notification candidat:", e);
    }

    try {
      await insertAdminNotification({
        type: "dossier",
        titre: "Nouveau dossier déposé",
        message: `${created.prenom} ${created.nom} — ${created.email}`,
        candidatId: created.id,
      });
    } catch (e) {
      console.error("Notification admin:", e);
    }

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST dossier public", e);
    if (isDuplicateKeyError(e)) {
      return NextResponse.json(
        {
          code: "duplicate",
          error:
            "Un dossier existe déjà avec ces informations. Connectez-vous plutôt que de créer un second dossier.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement. Réessayez ou contactez F2M." },
      { status: 500 }
    );
  }
}
