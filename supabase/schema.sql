-- F2M Consulting — schéma Supabase
-- Exécuter dans : Supabase Dashboard → SQL Editor → New query → Run

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Partenaires (centres de formation)
CREATE TABLE IF NOT EXISTS partenaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  ville TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profils liés à Clerk
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'candidat', 'partenaire')),
  email TEXT,
  partenaire_id UUID REFERENCES partenaires(id) ON DELETE SET NULL,
  candidat_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_clerk ON profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Candidats
CREATE TABLE IF NOT EXISTS candidats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT DEFAULT '',
  date_naissance DATE,
  lieu_naissance TEXT DEFAULT '',
  adresse TEXT DEFAULT '',
  code_postal TEXT DEFAULT '',
  ville TEXT DEFAULT '',
  numero_secu TEXT,
  numero_carte_vitale TEXT,
  code_insee TEXT,
  parcours TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'demande'
    CHECK (statut IN ('demande', 'accepte', 'refuse', 'en_formation', 'diplome')),
  partenaire_id UUID REFERENCES partenaires(id) ON DELETE SET NULL,
  date_demande DATE NOT NULL DEFAULT CURRENT_DATE,
  date_acceptation DATE,
  date_diplome DATE,
  numero_diplome TEXT,
  experience_secu BOOLEAN NOT NULL DEFAULT false,
  diplome_scolaire BOOLEAN NOT NULL DEFAULT false,
  pieces_jointes JSONB NOT NULL DEFAULT '[]'::jsonb,
  fiche JSONB NOT NULL DEFAULT '{}'::jsonb,
  liens JSONB NOT NULL DEFAULT '{"eLearningUrl":"","teamsUrl":null}'::jsonb,
  notes TEXT,
  clerk_user_id TEXT UNIQUE,
  banni BOOLEAN NOT NULL DEFAULT false,
  banni_le TIMESTAMPTZ,
  banni_raison TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidats_token ON candidats(token);
CREATE INDEX IF NOT EXISTS idx_candidats_statut ON candidats(statut);
CREATE INDEX IF NOT EXISTS idx_candidats_partenaire ON candidats(partenaire_id);
CREATE INDEX IF NOT EXISTS idx_candidats_date_demande ON candidats(date_demande);

-- Documents générés
CREATE TABLE IF NOT EXISTS documents_generes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidat_id UUID NOT NULL REFERENCES candidats(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  nom TEXT NOT NULL,
  genere_le DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_candidat ON documents_generes(candidat_id);

-- Fichiers uploadés / générés (PDF Supabase, autres Cloudinary)
CREATE TABLE IF NOT EXISTS documents_fichiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidat_id UUID NOT NULL REFERENCES candidats(id) ON DELETE CASCADE,
  nom_fichier TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  taille_octets BIGINT NOT NULL DEFAULT 0,
  storage TEXT NOT NULL CHECK (storage IN ('supabase', 'cloudinary')),
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('eleve', 'admin', 'auto_genere')),
  statut_envoi TEXT NOT NULL DEFAULT 'envoye' CHECK (statut_envoi IN ('brouillon', 'envoye')),
  template_type TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_fichiers_candidat ON documents_fichiers(candidat_id);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidat_id UUID NOT NULL REFERENCES candidats(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('document', 'statut', 'relance', 'info')),
  titre TEXT NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS relances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidat_id UUID NOT NULL REFERENCES candidats(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  email_envoye BOOLEAN NOT NULL DEFAULT false,
  envoye_par TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mise à jour automatique updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS candidats_updated_at ON candidats;
CREATE TRIGGER candidats_updated_at
  BEFORE UPDATE ON candidats
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS activé (accès via API serveur avec service role)
ALTER TABLE partenaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidats ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_generes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_fichiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE relances ENABLE ROW LEVEL SECURITY;

-- Partenaire exemple (optionnel — adapter l'e-mail à votre compte Clerk)
INSERT INTO partenaires (slug, nom, ville, email)
VALUES ('marseille-sud', 'Centre Formation Marseille Sud', 'Marseille', 'contact@cf-marseille-sud.fr')
ON CONFLICT (slug) DO NOTHING;
