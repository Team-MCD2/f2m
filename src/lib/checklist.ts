import type { ParcoursType, PieceJointe } from "@/types";

export interface ChecklistItem {
  id: string;
  label: string;
  obligatoire: boolean;
  condition?: string;
}

export function getChecklistItems(
  parcours: ParcoursType,
  experienceSecu: boolean,
  diplomeScolaire: boolean
): ChecklistItem[] {
  const base: ChecklistItem[] = [
    { id: "cni", label: "Pièce d'identité ou carte de séjour (en cours de validité)", obligatoire: true },
    { id: "cv", label: "CV", obligatoire: true },
    { id: "domicile", label: "Justificatif de domicile", obligatoire: true },
    { id: "vitale", label: "Carte Vitale", obligatoire: true },
    { id: "b3", label: "Formulaire B3", obligatoire: true },
    { id: "kbis", label: "Extrait Kbis / CABIS", obligatoire: true },
    {
      id: "diplome",
      label: "Diplômes scolaires (bac et plus)",
      obligatoire: !experienceSecu && !diplomeScolaire,
      condition: !experienceSecu ? "Obligatoire sans expérience sécu" : "Facultatif avec expérience sécu",
    },
    {
      id: "contrat_secu",
      label: "Justificatif expérience en sécurité (contrats)",
      obligatoire: !diplomeScolaire && !experienceSecu,
      condition: experienceSecu ? "Fourni — remplace le diplôme" : "Obligatoire sans diplôme",
    },
    { id: "photos", label: "Photos d'identité (remise physique)", obligatoire: false, condition: "À remettre en physique pour le diplôme" },
  ];

  if (parcours === "vae" || parcours === "viae") {
    base.push({
      id: "fiches_paie",
      label: "Fiches de paie",
      obligatoire: parcours === "vae",
      condition: "Obligatoire pour le parcours VAE",
    });
  }

  if (parcours === "viae") {
    base.push(
      { id: "sarfa", label: "Demande de recevabilité (SARFA)", obligatoire: true, condition: "Parcours VIAE" },
      { id: "livret2", label: "Livret 2 — dossier d'expérience", obligatoire: true, condition: "Après recevabilité validée" }
    );
  }

  if (parcours === "apprentissage") {
    base.push({ id: "contrat_app", label: "Contrat d'apprentissage", obligatoire: true, condition: "Parcours apprentissage" });
  }

  if (parcours === "contre_livret") {
    base.push({ id: "livret_precedent", label: "Livret / attestations formation antérieure", obligatoire: true, condition: "Contre un livret" });
  }

  return base;
}

export function piecesFromChecklist(
  items: ChecklistItem[],
  uploaded: Record<string, boolean>
): PieceJointe[] {
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    obligatoire: item.obligatoire,
    fournie: uploaded[item.id] ?? false,
    fichierNom: uploaded[item.id] ? `${item.id}.pdf` : undefined,
  }));
}

export function isChecklistComplete(pieces: PieceJointe[]): boolean {
  return pieces.filter((p) => p.obligatoire).every((p) => p.fournie);
}
