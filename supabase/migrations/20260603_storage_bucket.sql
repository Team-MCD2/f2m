-- Bucket Storage + lecture publique (complément au script npm run setup:storage)
-- Exécuter dans Supabase → SQL Editor si le script API échoue ou pour les politiques RLS

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'candidat-documents',
  'candidat-documents',
  true,
  20971520,
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html',
    'text/plain'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lecture : tout le monde peut voir les fichiers du bucket (URLs publiques)
DROP POLICY IF EXISTS "Public read candidat documents" ON storage.objects;
CREATE POLICY "Public read candidat documents"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'candidat-documents');

-- Écriture : uniquement via la clé service (API Next.js) — pas d'upload direct navigateur → Storage
-- Le service role contourne RLS ; pas de policy INSERT pour anon/authenticated nécessaire.
