import type { Candidat } from "@/types";
import { PARCOURS_LABELS } from "@/types";

export interface CandidatStatsSummary {
  total: number;
  demande: number;
  accepte: number;
  refuse: number;
  enFormation: number;
  diplome: number;
  actifs: number;
  ceMois: number;
  documentsGeneres: number;
  partenaires: number;
  tauxAcceptation: number;
  tauxRefus: number;
  parcoursPrincipal: { label: string; count: number } | null;
}

function isCurrentMonth(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function computeCandidatStats(candidats: Candidat[]): CandidatStatsSummary {
  const total = candidats.length;
  const demande = candidats.filter((c) => c.statut === "demande").length;
  const accepte = candidats.filter((c) => c.statut === "accepte").length;
  const refuse = candidats.filter((c) => c.statut === "refuse").length;
  const enFormation = candidats.filter((c) => c.statut === "en_formation").length;
  const diplome = candidats.filter((c) => c.statut === "diplome").length;
  const actifs = accepte + enFormation + diplome;
  const ceMois = candidats.filter((c) => isCurrentMonth(c.dateDemande)).length;
  const documentsGeneres = candidats.reduce(
    (sum, c) => sum + c.documentsGeneres.length,
    0
  );
  const partenaires = new Set(
    candidats.map((c) => c.partenaireId).filter(Boolean)
  ).size;

  const tauxAcceptation = total > 0 ? Math.round((actifs / total) * 1000) / 10 : 0;
  const tauxRefus = total > 0 ? Math.round((refuse / total) * 1000) / 10 : 0;

  const parcoursMap = new Map<string, number>();
  candidats.forEach((c) => {
    const label = PARCOURS_LABELS[c.parcours];
    parcoursMap.set(label, (parcoursMap.get(label) ?? 0) + 1);
  });
  let parcoursPrincipal: { label: string; count: number } | null = null;
  parcoursMap.forEach((count, label) => {
    if (!parcoursPrincipal || count > parcoursPrincipal.count) {
      parcoursPrincipal = { label, count };
    }
  });

  return {
    total,
    demande,
    accepte,
    refuse,
    enFormation,
    diplome,
    actifs,
    ceMois,
    documentsGeneres,
    partenaires,
    tauxAcceptation,
    tauxRefus,
    parcoursPrincipal,
  };
}
