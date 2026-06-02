import type { DocumentType, ParcoursType } from "@/types";
import { DOCUMENT_LABELS } from "@/types";

export interface DocumentTemplateMeta {
  id: DocumentType | string;
  nom: string;
  description: string;
  categorie: "admission" | "formation" | "certification" | "administratif";
  parcours: ParcoursType[] | "tous";
  disponible: boolean;
}

/** Modèles mock (~10 documents) — certains réservés à une phase ultérieure */
export const DOCUMENT_TEMPLATES: DocumentTemplateMeta[] = [
  {
    id: "fiche_renseignement",
    nom: DOCUMENT_LABELS.fiche_renseignement,
    description: "Informations personnelles et parcours choisi",
    categorie: "admission",
    parcours: "tous",
    disponible: true,
  },
  {
    id: "attestation_entree",
    nom: DOCUMENT_LABELS.attestation_entree,
    description: "Remise au début de la formation",
    categorie: "formation",
    parcours: ["formation_continue", "apprentissage", "viae"],
    disponible: true,
  },
  {
    id: "attestation_fin",
    nom: DOCUMENT_LABELS.attestation_fin,
    description: "À signer en fin de parcours",
    categorie: "formation",
    parcours: "tous",
    disponible: true,
  },
  {
    id: "feuille_emargement",
    nom: DOCUMENT_LABELS.feuille_emargement,
    description: "Présence aux sessions présentielles",
    categorie: "formation",
    parcours: "tous",
    disponible: true,
  },
  {
    id: "sarfa_vae",
    nom: "Demande de recevabilité VAE (SARFA)",
    description: "Première étape parcours VAE / VIAE",
    categorie: "admission",
    parcours: ["vae", "viae"],
    disponible: false,
  },
  {
    id: "livret2",
    nom: "Livret 2 — Dossier expérience",
    description: "Compétences et expériences professionnelles",
    categorie: "certification",
    parcours: ["vae", "viae"],
    disponible: false,
  },
  {
    id: "fiche_qualite",
    nom: "Fiche qualité satisfaction",
    description: "Évaluation obligatoire fin de formation",
    categorie: "administratif",
    parcours: "tous",
    disponible: false,
  },
  {
    id: "convocation",
    nom: "Convocation examen",
    description: "Date et lieu de certification",
    categorie: "certification",
    parcours: "tous",
    disponible: false,
  },
  {
    id: "grille_jury",
    nom: "Grille jury",
    description: "Évaluation apte / non apte",
    categorie: "certification",
    parcours: "tous",
    disponible: false,
  },
  {
    id: "certificat_realisation",
    nom: "Certificat de réalisation",
    description: "Document administratif CPF / financement",
    categorie: "administratif",
    parcours: "tous",
    disponible: false,
  },
];
