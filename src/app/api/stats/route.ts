import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { fetchDashboardStats } from "@/lib/supabase/queries";

export async function GET() {
  try {
    await requireRole(["admin"]);
    const stats = await fetchDashboardStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}
