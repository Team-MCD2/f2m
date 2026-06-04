import type { DocumentKind, ParcoursType } from "@/types/database";

export const PARCOURS_LABELS: Record<ParcoursType, string> = {
  formation_continue: "Formation continue",
  vae: "VAE",
  apprentissage: "Apprentissage",
  contre_livre: "Contre un livre",
};

export const STATUS_LABELS = {
  pending: "En attente",
  accepted: "Accepté",
  rejected: "Refusé",
} as const;

export const DOCUMENT_LABELS: Record<DocumentKind, string> = {
  piece_identite: "Pièce d'identité (en cours de validité)",
  carte_sejour: "Carte de séjour",
  cv: "CV",
  diplome_scolaire: "Diplôme scolaire (bac+)",
  justificatif_domicile: "Justificatif de domicile",
  b3: "Formulaire B3",
  cabinet_creation: "CABIS / création société",
  fiche_paie: "Fiches de paie",
  carte_vitale: "Carte Vitale",
  photo: "Photo d'identité",
  autre: "Autre document",
};

export const STORAGE_BUCKET = "candidate-documents";

export interface RequiredDocRule {
  kind: DocumentKind;
  required: boolean;
  label: string;
}

/** Pièces obligatoires selon le profil candidat */
export function getRequiredDocuments(input: {
  a_experience_secu: boolean;
  a_diplome_scolaire: boolean;
  parcours: ParcoursType;
}): RequiredDocRule[] {
  const { a_experience_secu, a_diplome_scolaire, parcours } = input;
  const needDiplome = !a_experience_secu && !a_diplome_scolaire;
  const isVae = parcours === "vae";

  return [
    { kind: "piece_identite", required: true, label: DOCUMENT_LABELS.piece_identite },
    { kind: "cv", required: true, label: DOCUMENT_LABELS.cv },
    { kind: "b3", required: true, label: DOCUMENT_LABELS.b3 },
    { kind: "cabinet_creation", required: true, label: DOCUMENT_LABELS.cabinet_creation },
    {
      kind: "diplome_scolaire",
      required: needDiplome,
      label: DOCUMENT_LABELS.diplome_scolaire,
    },
    {
      kind: "justificatif_domicile",
      required: false,
      label: DOCUMENT_LABELS.justificatif_domicile,
    },
    {
      kind: "fiche_paie",
      required: isVae,
      label: DOCUMENT_LABELS.fiche_paie,
    },
    { kind: "carte_vitale", required: false, label: DOCUMENT_LABELS.carte_vitale },
    { kind: "photo", required: false, label: DOCUMENT_LABELS.photo },
  ];
}
