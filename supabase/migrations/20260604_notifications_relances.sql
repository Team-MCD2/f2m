-- Notifications candidat + historique relances email

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidat_id UUID NOT NULL REFERENCES candidats(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('document', 'statut', 'relance', 'info')),
  titre TEXT NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_candidat ON notifications(candidat_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

CREATE TABLE IF NOT EXISTS relances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidat_id UUID NOT NULL REFERENCES candidats(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  email_envoye BOOLEAN NOT NULL DEFAULT false,
  envoye_par TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_relances_candidat ON relances(candidat_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE relances ENABLE ROW LEVEL SECURITY;
