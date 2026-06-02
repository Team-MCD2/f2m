import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { insertDocument } from "@/lib/supabase/queries";
import { DOCUMENT_LABELS } from "@/types";
import type { DocumentType } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
    const { id } = await params;
    const { type } = await request.json();

    if (!type || !(type in DOCUMENT_LABELS)) {
      return NextResponse.json({ error: "Type de document invalide." }, { status: 400 });
    }

    const candidat = await insertDocument(
      id,
      type as DocumentType,
      DOCUMENT_LABELS[type as DocumentType]
    );

    return NextResponse.json(candidat);
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}
