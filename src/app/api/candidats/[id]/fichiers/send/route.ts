import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { sendDocumentsFichiers } from "@/lib/supabase/queries";
import { insertNotification } from "@/lib/supabase/notifications";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
    const { id } = await params;
    const body = await request.json();
    const all = Boolean(body.all);
    const ids = Array.isArray(body.ids) ? (body.ids as string[]) : undefined;

    const sent = await sendDocumentsFichiers(id, { all, ids });

    if (sent.length === 0) {
      return NextResponse.json(
        { error: "Aucun brouillon à envoyer (déjà envoyés ou introuvables)." },
        { status: 400 }
      );
    }

    if (sent.length === 1) {
      await insertNotification({
        candidatId: id,
        type: "document",
        titre: "Nouveau document disponible",
        message: `« ${sent[0].nomFichier} » est disponible dans votre espace « Mes documents ».`,
      });
    } else {
      await insertNotification({
        candidatId: id,
        type: "document",
        titre: "Documents F2M disponibles",
        message: `${sent.length} documents sont disponibles dans « Mes documents ». Vous pouvez les consulter et les télécharger.`,
      });
    }

    return NextResponse.json({ sent, count: sent.length });
  } catch (e) {
    console.error("POST fichiers/send", e);
    const msg = e instanceof Error ? e.message : "Erreur envoi.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
