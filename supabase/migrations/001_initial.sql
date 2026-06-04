-- F2M CRM v1 — exécuter dans l'éditeur SQL Supabase

CREATE TYPE candidate_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE parcours_type AS ENUM ('formation_continue', 'vae', 'apprentissage', 'contre_livre');
CREATE TYPE document_kind AS ENUM (
  'piece_identite',
  'carte_sejour',
  'cv',
  'diplome_scolaire',
  'justificatif_domicile',
  'b3',
  'cabinet_creation',
  'fiche_paie',
  'carte_vitale',
  'photo',
  'autre'
);

CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status candidate_status NOT NULL DEFAULT 'pending',
  parcours parcours_type NOT NULL DEFAULT 'formation_continue',
  -- Identité
  civilite TEXT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE,
  lieu_naissance TEXT,
  nationalite TEXT,
  -- Contact
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  -- Parcours / admin
  a_experience_secu BOOLEAN NOT NULL DEFAULT false,
  a_diplome_scolaire BOOLEAN NOT NULL DEFAULT false,
  parcours_vae BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  numero_diplome TEXT,
  numero_carte_vitale TEXT,
  code_insee_commune TEXT,
  -- Lien candidature publique
  access_token UUID UNIQUE DEFAULT gen_random_uuid(),
  -- Métadonnées
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE candidate_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  kind document_kind NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_nom ON candidates(nom, prenom);
CREATE INDEX idx_candidates_token ON candidates(access_token);
CREATE INDEX idx_documents_candidate ON candidate_documents(candidate_id);

-- Bucket storage : créer "candidate-documents" (privé) dans Supabase Storage

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_documents ENABLE ROW LEVEL SECURITY;

-- v1 : accès via service role côté serveur Next.js (Clerk protège l'admin)
CREATE POLICY "service_role_all_candidates" ON candidates
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_documents" ON candidate_documents
  FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
