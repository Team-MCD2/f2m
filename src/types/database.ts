export type CandidateStatus = "pending" | "accepted" | "rejected";

export type ParcoursType =
  | "formation_continue"
  | "vae"
  | "apprentissage"
  | "contre_livre";

export type DocumentKind =
  | "piece_identite"
  | "carte_sejour"
  | "cv"
  | "diplome_scolaire"
  | "justificatif_domicile"
  | "b3"
  | "cabinet_creation"
  | "fiche_paie"
  | "carte_vitale"
  | "photo"
  | "autre";

export interface Candidate {
  id: string;
  status: CandidateStatus;
  parcours: ParcoursType;
  civilite: string | null;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  lieu_naissance: string | null;
  nationalite: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  a_experience_secu: boolean;
  a_diplome_scolaire: boolean;
  parcours_vae: boolean;
  notes: string | null;
  numero_diplome: string | null;
  numero_carte_vitale: string | null;
  code_insee_commune: string | null;
  access_token: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateDocument {
  id: string;
  candidate_id: string;
  kind: DocumentKind;
  file_name: string;
  storage_path: string;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
}

export type CandidateInsert = Omit<
  Candidate,
  "id" | "access_token" | "created_at" | "updated_at" | "submitted_at" | "reviewed_at" | "reviewed_by"
> & {
  id?: string;
  access_token?: string;
};
