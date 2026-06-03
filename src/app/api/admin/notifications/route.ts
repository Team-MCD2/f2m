import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  countUnreadAdminNotifications,
  fetchAdminNotifications,
  markAdminNotificationsRead,
} from "@/lib/supabase/admin-notifications";

export async function GET(request: Request) {
  try {
    await requireRole(["admin"]);
    const since = new URL(request.url).searchParams.get("since") ?? undefined;
    const notifications = await fetchAdminNotifications(since);
    const unreadCount = await countUnreadAdminNotifications();

    return NextResponse.json({ notifications, unreadCount, pollIntervalMs: 120_000 });
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}

export async function PATCH() {
  try {
    await requireRole(["admin"]);
    await markAdminNotificationsRead();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
