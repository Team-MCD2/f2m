-- Statut d'envoi : brouillon (admin seul) ou envoye (visible candidat)
ALTER TABLE documents_fichiers
  ADD COLUMN IF NOT EXISTS statut_envoi TEXT NOT NULL DEFAULT 'envoye'
  CHECK (statut_envoi IN ('brouillon', 'envoye'));

CREATE INDEX IF NOT EXISTS idx_documents_fichiers_statut
  ON documents_fichiers(candidat_id, statut_envoi);

-- Documents auto-générés existants : laisser en « envoye » pour ne pas masquer l'historique.
-- Les nouvelles générations passent en « brouillon » via l'application.
