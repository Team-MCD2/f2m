# Bucket Supabase Storage — comment ça marche

## En une phrase

Les fichiers (surtout les **PDF**) sont stockés dans un **dossier cloud** Supabase nommé `candidat-documents`. L’application y **écrit** avec la clé secrète serveur et les élèves/admins **lisent** via une URL publique.

---

## Schéma du flux

```
Élève ou Admin (navigateur)
        │
        │  glisse un fichier
        ▼
API Next.js  POST /api/candidats/[id]/fichiers
        │
        │  clé SUPABASE_SERVICE_ROLE_KEY (jamais exposée au navigateur)
        ▼
Supabase Storage  bucket « candidat-documents »
        │
        │  chemin : {candidatId}/{timestamp}-{nom-fichier}
        ▼
Table SQL  documents_fichiers  (nom, url, type, source…)
        │
        ▼
Interface  liste « Mes documents » / profil admin
```

**Pourquoi passer par l’API ?**  
Le navigateur n’a pas accès à la clé `service_role`. Seul le serveur Next.js peut uploader en toute sécurité. Les métadonnées (qui a envoyé quoi) sont enregistrées dans PostgreSQL.

---

## Créer le bucket (2 méthodes)

### Méthode 1 — Script (recommandé)

```bash
npm run setup:storage
```

Le script lit `.env.local`, se connecte à Supabase et crée le bucket `candidat-documents` (public, max 20 Mo).

### Méthode 2 — SQL

Si le script renvoie une erreur de permissions, ouvrez **Supabase → SQL Editor** et exécutez :

`supabase/migrations/20260603_storage_bucket.sql`

Cela crée le bucket **et** la politique de **lecture publique**.

---

## Variables d’environnement

| Variable | Rôle |
|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Adresse du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé admin (upload / suppression côté serveur) |
| `SUPABASE_STORAGE_BUCKET` | Nom du bucket (défaut : `candidat-documents`) |

---

## PDF vs autres fichiers

| Type | Stockage |
|------|----------|
| PDF | **Supabase** (bucket) |
| Images, Word, HTML | **Cloudinary** si configuré, sinon Supabase |

Cloudinary est optionnel (`CLOUDINARY_*` dans `.env.local`). Sans Cloudinary, tout part dans le même bucket Supabase.

---

## Structure des fichiers dans le bucket

Exemple de chemin :

```
candidat-documents/
  └── a1b2c3d4-uuid-du-candidat/
        └── 1717420800000-carte_identite.pdf
```

L’URL publique ressemble à :

`https://xxxx.supabase.co/storage/v1/object/public/candidat-documents/{candidatId}/{fichier}`

Cette URL est sauvegardée dans `documents_fichiers.url`.

---

## Sécurité (niveau actuel)

- **Upload** : uniquement via API (Clerk + rôle admin ou candidat propriétaire).
- **Lecture** : bucket **public** → quiconque a l’URL peut ouvrir le fichier (comme un lien Google Drive public).
- Pour une v2 plus stricte : bucket **privé** + URLs signées temporaires.

---

## Dépannage

| Problème | Solution |
|----------|----------|
| `Bucket not found` | `npm run setup:storage` ou SQL migration storage |
| `new row violates row-level security` sur Storage | Exécuter `20260603_storage_bucket.sql` |
| Upload OK mais lien 404 | Vérifier que le bucket est **public** |
| Table `documents_fichiers` manquante | Exécuter `20260603_documents_fichiers.sql` |
