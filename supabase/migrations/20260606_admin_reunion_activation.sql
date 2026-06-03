-- Notifications admin + liens réunion par formation + activation mot de passe

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'dossier',
  titre TEXT NOT NULL,
  message TEXT NOT NULL,
  candidat_id UUID REFERENCES candidats(id) ON DELETE CASCADE,
  lu BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at DESC);

CREATE TABLE IF NOT EXISTS liens_reunion (
  parcours TEXT PRIMARY KEY,
  teams_url TEXT NOT NULL DEFAULT '',
  elearning_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO liens_reunion (parcours, teams_url, elearning_url) VALUES
  ('formation_continue', '', ''),
  ('vae', '', ''),
  ('viae', '', ''),
  ('apprentissage', '', ''),
  ('contre_livret', '', '')
ON CONFLICT (parcours) DO NOTHING;

ALTER TABLE candidats
  ADD COLUMN IF NOT EXISTS mot_de_passe_defini BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE liens_reunion ENABLE ROW LEVEL SECURITY;
