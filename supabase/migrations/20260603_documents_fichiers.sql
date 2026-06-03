-- Documents fichiers (upload élève / admin / génération auto)
-- Exécuter dans Supabase SQL Editor après schema.sql

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
  template_type TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_fichiers_candidat ON documents_fichiers(candidat_id);
CREATE INDEX IF NOT EXISTS idx_documents_fichiers_source ON documents_fichiers(source);

ALTER TABLE documents_fichiers ENABLE ROW LEVEL SECURITY;

-- Bucket Storage : npm run setup:storage
-- ou supabase/migrations/20260603_storage_bucket.sql
