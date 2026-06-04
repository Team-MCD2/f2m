import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateFr } from "@/lib/format-date";

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "accepted";
  const formatOut = searchParams.get("format") ?? "csv";

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("candidates")
    .select(
      "nom, prenom, date_naissance, lieu_naissance, email, telephone, numero_carte_vitale, numero_diplome, code_insee_commune, parcours, status, submitted_at, reviewed_at",
    )
    .eq("status", status)
    .order("nom", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];
  const headers = [
    "Nom",
    "Prénom",
    "Date naissance",
    "Lieu naissance",
    "Email",
    "Téléphone",
    "N° carte vitale",
    "N° diplôme",
    "Code INSEE",
    "Parcours",
    "Statut",
    "Soumis le",
    "Validé le",
  ];

  if (formatOut === "xml") {
    const xmlRows = rows
      .map((r) => {
        const fields = [
          ["nom", r.nom],
          ["prenom", r.prenom],
          ["date_naissance", r.date_naissance ?? ""],
          ["lieu_naissance", r.lieu_naissance ?? ""],
          ["email", r.email ?? ""],
          ["telephone", r.telephone ?? ""],
          ["numero_carte_vitale", r.numero_carte_vitale ?? ""],
          ["numero_diplome", r.numero_diplome ?? ""],
          ["code_insee_commune", r.code_insee_commune ?? ""],
          ["parcours", r.parcours],
        ];
        const inner = fields
          .map(
            ([tag, val]) =>
              `    <${tag}>${escapeXml(String(val))}</${tag}>`,
          )
          .join("\n");
        return `  <candidat>\n${inner}\n  </candidat>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<candidats>\n${xmlRows}\n</candidats>`;
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="f2m-cdc-${status}.xml"`,
      },
    });
  }

  const csvLines = [
    headers.join(";"),
    ...rows.map((r) =>
      [
        r.nom,
        r.prenom,
        r.date_naissance ?? "",
        r.lieu_naissance ?? "",
        r.email ?? "",
        r.telephone ?? "",
        r.numero_carte_vitale ?? "",
        r.numero_diplome ?? "",
        r.code_insee_commune ?? "",
        r.parcours,
        r.status,
        r.submitted_at
          ? formatDateFr(r.submitted_at, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
        r.reviewed_at
          ? formatDateFr(r.reviewed_at, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(";"),
    ),
  ];

  return new NextResponse(csvLines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="f2m-cdc-${status}.csv"`,
    },
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
