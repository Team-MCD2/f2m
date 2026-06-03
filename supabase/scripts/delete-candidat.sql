-- =============================================================================
-- F2M — Supprimer un candidat et toutes ses données liées (Supabase)
-- =============================================================================
-- Où exécuter : Supabase Dashboard → SQL Editor → New query → coller → Run
--
-- Supprime automatiquement (CASCADE ou manuel) :
--   documents_generes, documents_fichiers, notifications, relances,
--   admin_notifications, profil Supabase (profiles)
--
-- NE supprime PAS le compte Clerk : à faire dans https://dashboard.clerk.com
--   (Users → rechercher l'email → Delete user)
--
-- Les fichiers du bucket Storage ne sont pas supprimés par ce SQL.
--   Utilisez plutôt : npm run delete:candidat -- --email=...  (supprime aussi le storage)
-- =============================================================================

-- ▼▼▼ MODIFIER UN SEUL CRITÈRE (les autres à NULL) ▼▼▼
DO $$
DECLARE
  p_email TEXT := 'linuxcam05@gmail.com';  -- ex. linuxcam05@gmail.com
  p_token TEXT := NULL;                     -- ex. cam-linux
  p_id    UUID := NULL;                     -- ex. uuid du candidat
  --
  v_row       RECORD;
  v_deleted   INT;
BEGIN
  IF p_email IS NULL AND p_token IS NULL AND p_id IS NULL THEN
    RAISE EXCEPTION 'Renseignez au moins p_email, p_token ou p_id dans le script.';
  END IF;

  SELECT id, token, email, prenom, nom, clerk_user_id
  INTO v_row
  FROM candidats
  WHERE (p_id IS NOT NULL AND id = p_id)
     OR (p_token IS NOT NULL AND token = lower(trim(p_token)))
     OR (p_email IS NOT NULL AND email ILIKE trim(p_email))
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE NOTICE 'Aucun candidat trouvé pour ces critères.';
    RETURN;
  END IF;

  RAISE NOTICE 'Candidat : % % | % | token=% | clerk=%',
    v_row.prenom, v_row.nom, v_row.email, v_row.token, coalesce(v_row.clerk_user_id, '(aucun)');

  -- Profil applicatif (lien Clerk)
  DELETE FROM profiles
  WHERE clerk_user_id = v_row.clerk_user_id
     OR candidat_token = v_row.token;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RAISE NOTICE 'Profils supprimés : %', v_deleted;

  -- Notifications admin pointant vers ce dossier
  DELETE FROM admin_notifications WHERE candidat_id = v_row.id;

  -- Candidat → CASCADE sur documents_*, notifications, relances
  DELETE FROM candidats WHERE id = v_row.id;

  RAISE NOTICE 'OK — Candidat % supprimé de Supabase.', v_row.id;
  RAISE NOTICE '→ Supprimez l''utilisateur Clerk manuellement si email : %', v_row.email;
END $$;

-- -----------------------------------------------------------------------------
-- Vérifier qu''il ne reste plus de trace (optionnel)
-- -----------------------------------------------------------------------------
-- SELECT * FROM candidats WHERE email ILIKE 'linuxcam05@gmail.com';
-- SELECT * FROM profiles WHERE email ILIKE 'linuxcam05@gmail.com';
