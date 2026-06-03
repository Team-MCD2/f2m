# Configuration documents (upload + génération auto)

## 1. Base de données

Exécuter dans Supabase SQL Editor :

- `supabase/schema.sql` (section `documents_fichiers`) **ou**
- `supabase/migrations/20260603_documents_fichiers.sql`

## 2. Bucket Supabase Storage

**Option A — script (recommandé)**

```bash
npm run setup:storage
```

**Option B — SQL** : `supabase/migrations/20260603_storage_bucket.sql`

**Explication détaillée** : voir `docs/STORAGE_BUCKET.md`

Dans `.env.local` :

```env
SUPABASE_STORAGE_BUCKET=candidat-documents
```

## 3. Cloudinary (optionnel)

Pour images et fichiers non-PDF. Les **PDF** sont toujours envoyés vers **Supabase**.

```env
CLOUDINARY_CLOUD_NAME=votre_cloud
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Sans Cloudinary, tous les fichiers passent par Supabase.

## 4. Comportement

| Action | Résultat |
|--------|----------|
| Élève glisse un fichier | Visible sur profil admin + « Mes documents » |
| Admin glisse sur le profil | Visible côté élève |
| Admin accepte le dossier | 4 documents F2M générés automatiquement |
| Admin clique « Générer » | Document HTML stocké + visible élève |
