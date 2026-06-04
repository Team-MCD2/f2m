export type DbRole = "admin" | "candidat" | "partenaire";

export interface DbPartenaire {
  id: string;
  slug: string;
  nom: string;
  ville: string | null;
  email: string;
  created_at: string;
}

export interface DbProfile {
  id: string;
  clerk_user_id: string;
  role: DbRole;
  email: string | null;
  partenaire_id: string | null;
  candidat_token: string | null;
  created_at: string;
}

export interface DbCandidat {
  id: string;
  token: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  date_naissance: string | null;
  lieu_naissance: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  numero_secu: string | null;
  numero_carte_vitale: string | null;
  code_insee: string | null;
  parcours: string;
  statut: string;
  partenaire_id: string | null;
  date_demande: string;
  date_acceptation: string | null;
  date_diplome: string | null;
  numero_diplome: string | null;
  experience_secu: boolean;
  diplome_scolaire: boolean;
  pieces_jointes: unknown;
  fiche: unknown;
  liens: unknown;
  notes: string | null;
  clerk_user_id: string | null;
  banni: boolean;
  banni_le: string | null;
  banni_raison: string | null;
  mot_de_passe_defini: boolean;
  created_at: string;
  updated_at: string;
  documents_generes?: DbDocument[];
}

export interface DbDocument {
  id: string;
  candidat_id: string;
  type: string;
  nom: string;
  genere_le: string;
  created_at: string;
}

export interface DbDocumentFichier {
  id: string;
  candidat_id: string;
  nom_fichier: string;
  mime_type: string;
  taille_octets: number;
  storage: "supabase" | "cloudinary";
  storage_path: string;
  url: string;
  source: "eleve" | "admin" | "auto_genere";
  statut_envoi: "brouillon" | "envoye";
  template_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  demande: number;
  accepte: number;
  refuse: number;
  enFormation: number;
  diplome: number;
  parMois: { mois: string; count: number }[];
  parParcours: { parcours: string; count: number }[];
}
