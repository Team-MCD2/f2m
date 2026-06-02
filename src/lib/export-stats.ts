import yaml from "js-yaml";
import type { Candidat } from "@/types";
import { PARCOURS_LABELS } from "@/types";
import { formatDate } from "@/lib/utils";
import type { DashboardStats } from "@/lib/supabase/types";

export interface StatsRow {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  numeroCarteVitale: string;
  codeInsee: string;
  parcours: string;
  dateAcceptation: string;
  numeroDiplome: string;
  statut: string;
}

export function candidatsToStatsRows(candidats: Candidat[]): StatsRow[] {
  return candidats
    .filter((c) => c.statut === "accepte" || c.statut === "en_formation" || c.statut === "diplome")
    .map((c) => ({
      nom: c.nom,
      prenom: c.prenom,
      dateNaissance: c.dateNaissance,
      lieuNaissance: c.lieuNaissance,
      numeroCarteVitale: c.numeroCarteVitale || "",
      codeInsee: c.codeInsee || "",
      parcours: PARCOURS_LABELS[c.parcours],
      dateAcceptation: c.dateAcceptation || c.dateDemande,
      numeroDiplome: c.numeroDiplome || "",
      statut: c.statut,
    }));
}

export function filterByPeriod(rows: StatsRow[], year: number, month?: number): StatsRow[] {
  return rows.filter((r) => {
    const d = new Date(r.dateAcceptation);
    if (month !== undefined) {
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    }
    return d.getFullYear() === year;
  });
}

const CSV_HEADERS: (keyof StatsRow)[] = [
  "nom",
  "prenom",
  "dateNaissance",
  "lieuNaissance",
  "numeroCarteVitale",
  "codeInsee",
  "parcours",
  "dateAcceptation",
  "numeroDiplome",
  "statut",
];

const CSV_LABELS: Record<keyof StatsRow, string> = {
  nom: "Nom",
  prenom: "Prénom",
  dateNaissance: "Date de naissance",
  lieuNaissance: "Lieu de naissance",
  numeroCarteVitale: "N° Carte Vitale",
  codeInsee: "Code INSEE",
  parcours: "Parcours",
  dateAcceptation: "Date acceptation",
  numeroDiplome: "N° diplôme",
  statut: "Statut",
};

export function exportToCsv(rows: StatsRow[], filename: string): void {
  const header = CSV_HEADERS.map((k) => CSV_LABELS[k]).join(";");
  const body = rows
    .map((row) =>
      CSV_HEADERS.map((k) => {
        const v = String(row[k] ?? "");
        return v.includes(";") ? `"${v}"` : v;
      }).join(";")
    )
    .join("\n");
  const bom = "\uFEFF";
  const blob = new Blob([bom + header + "\n" + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getPeriodLabel(year: number, month?: number): string {
  if (month !== undefined) {
    const d = new Date(year, month - 1, 1);
    return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  }
  return String(year);
}

export function formatStatsDate(dateStr: string): string {
  return formatDate(dateStr);
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToYaml(rows: StatsRow[], filename: string): void {
  const payload = {
    export: {
      genere_le: new Date().toISOString(),
      format: "f2m-stats-v1",
      nombre_lignes: rows.length,
    },
    candidats: rows.map((row) => ({
      nom: row.nom,
      prenom: row.prenom,
      date_naissance: row.dateNaissance,
      lieu_naissance: row.lieuNaissance,
      numero_carte_vitale: row.numeroCarteVitale,
      code_insee: row.codeInsee,
      parcours: row.parcours,
      date_acceptation: row.dateAcceptation,
      numero_diplome: row.numeroDiplome,
      statut: row.statut,
    })),
  };

  const content = yaml.dump(payload, { lineWidth: 120, noRefs: true });
  downloadBlob(content, filename, "application/x-yaml;charset=utf-8");
}

export function exportDashboardToYaml(stats: DashboardStats, filename: string): void {
  const payload = {
    tableau_de_bord: {
      genere_le: new Date().toISOString(),
      totaux: {
        total: stats.total,
        demandes: stats.demande,
        acceptes: stats.accepte,
        refuses: stats.refuse,
        en_formation: stats.enFormation,
        diplomes: stats.diplome,
      },
      evolution_mensuelle: stats.parMois,
      repartition_parcours: stats.parParcours,
    },
  };
  const content = yaml.dump(payload, { lineWidth: 120, noRefs: true });
  downloadBlob(content, filename, "application/x-yaml;charset=utf-8");
}
