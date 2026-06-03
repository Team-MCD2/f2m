import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  deleteCandidatById,
  fetchCandidatById,
  setCandidatBanni,
} from "@/lib/supabase/queries";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
    const { id } = await params;
    const body = await request.json();

    if (typeof body.banni !== "boolean") {
      return NextResponse.json({ error: "Champ banni requis." }, { status: 400 });
    }

    const updated = await setCandidatBanni(id, body.banni, body.raison as string | undefined);
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH admin candidat", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
    const { id } = await params;
    const existing = await fetchCandidatById(id);
    if (!existing) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    await deleteCandidatById(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE admin candidat", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur suppression" },
      { status: 500 }
    );
  }
}
