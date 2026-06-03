-- Bannissement candidats (accès bloqué, compte Clerk banni)

ALTER TABLE candidats
  ADD COLUMN IF NOT EXISTS banni BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS banni_le TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS banni_raison TEXT;

CREATE INDEX IF NOT EXISTS idx_candidats_banni ON candidats(banni) WHERE banni = true;
