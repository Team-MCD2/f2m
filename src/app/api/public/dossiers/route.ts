import { NextResponse } from "next/server";
import { insertCandidat } from "@/lib/supabase/queries";
import { candidatToDbInsert } from "@/lib/supabase/mappers";
import type { Candidat } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";
import { upsertProfile } from "@/lib/supabase/queries";
import { insertNotification } from "@/lib/supabase/notifications";

/** Dépôt de dossier sans connexion (première demande) */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Candidat;

    if (!body.nom || !body.prenom || !body.email || !body.token) {
      return NextResponse.json({ error: "Données incomplètes." }, { status: 400 });
    }

    body.statut = "demande";
    const row = candidatToDbInsert(body);
    const created = await insertCandidat(row);

    try {
      const clerk = await clerkClient();
      const password = `F2m-${body.token}-${Date.now().toString(36).slice(-4)}!`;
      const user = await clerk.users.createUser({
        emailAddress: [body.email],
        password,
        publicMetadata: {
          role: "candidat",
          candidat_token: body.token,
        },
        skipPasswordChecks: true,
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
        candidat_token: body.token,
      });
    } catch (clerkErr) {
      console.warn("Clerk user creation:", clerkErr);
    }

    await insertNotification({
      candidatId: created.id,
      type: "info",
      titre: "Dossier en cours de traitement",
      message:
        "Votre demande a bien été reçue. Vous serez notifié ici dès qu'il y a du nouveau (aucun rechargement manuel nécessaire).",
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST dossier public", e);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement." }, { status: 500 });
  }
}
