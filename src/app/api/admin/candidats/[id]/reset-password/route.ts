import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { regenerateAndEmailPassword } from "@/lib/auth/candidat-password";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
    const { id } = await params;
    await regenerateAndEmailPassword(id);
    return NextResponse.json({
      ok: true,
      message: "Nouveau mot de passe envoyé par email au candidat.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur" },
      { status: 500 }
    );
  }
}
