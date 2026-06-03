import { NextResponse } from "next/server";
import { assertCandidatAccess } from "@/lib/auth/candidat-access";
import { getSessionProfile } from "@/lib/auth/session";
import {
  fetchNotifications,
  markNotificationRead,
  markNotificationsRead,
} from "@/lib/supabase/notifications";
import { fetchCandidatById, fetchDocumentsFichiers } from "@/lib/supabase/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getSessionProfile();
    if (!profile) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    await assertCandidatAccess(profile, id);

    const since = new URL(request.url).searchParams.get("since") ?? undefined;
    const notifications = await fetchNotifications(id, since);
    const candidat = await fetchCandidatById(id);
    const fichiers = await fetchDocumentsFichiers(id);

    return NextResponse.json({
      notifications,
      statut: candidat?.statut,
      documentsCount: fichiers.length,
      pollIntervalMs: 120_000,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 403 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getSessionProfile();
    if (!profile) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { id } = await params;
    await assertCandidatAccess(profile, id);

    const body = await request.json().catch(() => ({}));
    const notificationId = body.notificationId as string | undefined;

    if (notificationId) {
      await markNotificationRead(id, notificationId);
    } else {
      await markNotificationsRead(id);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
