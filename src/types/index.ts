export type ParcoursType =
  | "formation_continue"
  | "vae"
  | "viae"
  | "apprentissage"
  | "contre_livret";

export type StatutCandidat =
  | "demande"
  | "accepte"
  | "refuse"
  | "en_formation"
  | "diplome";

export type DocumentType =
  | "fiche_renseignement"
  | "attestation_entree"
  | "attestation_fin"
  | "feuille_emargement";

export interface Partenaire {
  id: string;
  nom: string;
  ville: string;
  email: string;
}

export interface PieceJointe {
  id: string;
  label: string;
  obligatoire: boolean;
  fournie: boolean;
  fichierNom?: string;
}

export interface FicheRenseignement {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  codePostal: string;
  ville: string;
  numeroSecu?: string;
  experienceSecu: boolean;
  diplomeScolaire: boolean;
  rempli: boolean;
}

export interface DocumentGenere {
  id: string;
  type: DocumentType;
  nom: string;
  genereLe: string;
}

export type DocumentSource = "eleve" | "admin" | "auto_genere";
export type DocumentStorage = "supabase" | "cloudinary";

export interface DocumentFichier {
  id: string;
  candidatId: string;
  nomFichier: string;
  mimeType: string;
  tailleOctets: number;
  storage: DocumentStorage;
  storagePath: string;
  url: string;
  source: DocumentSource;
  templateType?: string;
  uploadedBy?: string;
  createdAt: string;
}

export const DOCUMENT_SOURCE_LABELS: Record<DocumentSource, string> = {
  eleve: "Déposé par l'élève",
  admin: "Déposé par l'administration",
  auto_genere: "Généré automatiquement",
};

export interface LiensCandidat {
  eLearningUrl: string;
  teamsUrl?: string;
}

export interface Candidat {
  id: string;
  token: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  codePostal: string;
  ville: string;
  numeroSecu?: string;
  numeroCarteVitale?: string;
  codeInsee?: string;
  parcours: ParcoursType;
  statut: StatutCandidat;
  partenaireId?: string;
  dateDemande: string;
  dateAcceptation?: string;
  dateDiplome?: string;
  numeroDiplome?: string;
  experienceSecu: boolean;
  diplomeScolaire: boolean;
  piecesJointes: PieceJointe[];
  fiche: FicheRenseignement;
  documentsGeneres: DocumentGenere[];
  liens: LiensCandidat;
  notes?: string;
  banni?: boolean;
  banniLe?: string;
  banniRaison?: string;
  clerkUserId?: string;
}

export const STATUT_LABELS: Record<StatutCandidat, string> = {
  demande: "Demande",
  accepte: "Accepté",
  refuse: "Refusé",
  en_formation: "En formation",
  diplome: "Diplômé",
};

export const PARCOURS_LABELS: Record<ParcoursType, string> = {
  formation_continue: "Formation continue",
  vae: "VAE",
  viae: "VIAE",
  apprentissage: "Apprentissage",
  contre_livret: "Contre un livret",
};

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  fiche_renseignement: "Fiche de renseignement",
  attestation_entree: "Attestation d'entrée en formation",
  attestation_fin: "Attestation de fin de formation",
  feuille_emargement: "Feuille d'émargement",
};

export const STATUT_COLORS: Record<StatutCandidat, string> = {
  demande: "bg-amber-100 text-amber-800",
  accepte: "bg-emerald-100 text-emerald-800",
  refuse: "bg-red-100 text-red-800",
  en_formation: "bg-indigo-100 text-indigo-800",
  diplome: "bg-f2m-navy text-white",
};
