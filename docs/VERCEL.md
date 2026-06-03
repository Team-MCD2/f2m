# Déploiement Vercel — F2M

URL production : **https://f2m-f1yb.vercel.app**

## Fichiers du projet

| Fichier | Rôle |
|---------|------|
| `vercel.json` | Région `cdg1` (Paris), build Next.js |
| `.env.vercel` | Variables prêtes pour import Vercel (gitignoré) |
| `npm run vercel:env` | Regénère `.env.vercel` depuis `.env.local` |

## Importer les variables (1ère fois ou mise à jour)

1. [vercel.com](https://vercel.com) → projet **f2m** (ou lier le repo Git)
2. **Settings → Environment Variables**
3. **Import .env** → choisir le fichier `.env.vercel` à la racine du projet
4. Cocher **Production**, **Preview**, **Development**
5. **Save** puis **Redeploy** le dernier déploiement

## Clerk (obligatoire)

Dans [Clerk Dashboard](https://dashboard.clerk.com) → votre application → **Paths / URLs** :

- Sign-in URL : `/connexion`
- After sign-in : `https://f2m-f1yb.vercel.app/connexion/callback`

**Allowed redirect URLs** (ajouter) :

- `https://f2m-f1yb.vercel.app`
- `https://f2m-f1yb.vercel.app/connexion/callback`
- `https://f2m-f1yb.vercel.app/*`

## Supabase

Migrations SQL à avoir exécutées dans Supabase SQL Editor (dossier `supabase/migrations/`), notamment `20260606_admin_reunion_activation.sql`.

## Déploiement Git

Push sur la branche connectée à Vercel → déploiement automatique.

```bash
git push origin main
```

## CLI (optionnel)

```bash
npx vercel link
npx vercel --prod
```
