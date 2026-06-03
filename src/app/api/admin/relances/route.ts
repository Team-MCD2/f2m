import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { relanceEmailHtml, sendRelanceEmail } from "@/lib/email/send-relance";
import { insertNotification, insertRelance } from "@/lib/supabase/notifications";
import { fetchCandidatById } from "@/lib/supabase/queries";
import { STATUT_LABELS } from "@/types";

export async function POST(request: Request) {
  try {
    const profile = await requireRole(["admin"]);
    const body = await request.json();
    const candidatIds = body.candidatIds as string[] | undefined;
    const message = String(body.message ?? "").trim();

    if (!candidatIds?.length) {
      return NextResponse.json({ error: "Sélectionnez au moins un candidat." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message de relance requis." }, { status: 400 });
    }

    const results: {
      id: string;
      ok: boolean;
      email?: boolean;
      error?: string;
      emailTo?: string;
    }[] = [];

    for (const candidatId of candidatIds) {
      const candidat = await fetchCandidatById(candidatId);
      if (!candidat) {
        results.push({ id: candidatId, ok: false, error: "Introuvable" });
        continue;
      }

      const subject = `F2M Consulting — Relance concernant votre dossier`;
      const html = relanceEmailHtml(candidat.prenom, candidat.nom, message);
      const emailResult = await sendRelanceEmail(candidat.email, subject, html);

      await insertNotification({
        candidatId,
        type: "relance",
        titre: "Message de l'équipe F2M",
        message,
      });

      await insertRelance({
        candidatId,
        message,
        emailEnvoye: emailResult.ok && !emailResult.mock,
        envoyePar: profile.clerk_user_id,
      });

      results.push({
        id: candidatId,
        ok: true,
        email: emailResult.ok && !emailResult.mock,
        error: emailResult.error,
        emailTo: candidat.email,
      });
    }

    const mock = results.some((r) => r.ok) && !process.env.RESEND_API_KEY;

    return NextResponse.json({
      results,
      mockEmail: mock,
      hint: mock
        ? "RESEND_API_KEY non configurée : notifications créées, emails simulés."
        : undefined,
    });
  } catch (e) {
    console.error("relances", e);
    return NextResponse.json({ error: "Non autorisé ou erreur serveur." }, { status: 500 });
  }
}

/** Liste candidats filtrés pour l'écran relances */
export async function GET(request: Request) {
  try {
    await requireRole(["admin"]);
    const statuts = new URL(request.url).searchParams.get("statuts");
    const allowed = statuts?.split(",").filter(Boolean) ?? ["demande", "accepte", "refuse"];

    const { fetchAllCandidats } = await import("@/lib/supabase/queries");
    const all = await fetchAllCandidats();
    const filtered = all
      .filter((c) => allowed.includes(c.statut))
      .map((c) => ({
        id: c.id,
        nom: c.nom,
        prenom: c.prenom,
        email: c.email,
        statut: c.statut,
        statutLabel: STATUT_LABELS[c.statut],
        token: c.token,
      }));

    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}
