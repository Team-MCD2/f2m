# Déployer le CRM F2M sur Vercel

Guide pas à pas pour héberger l’application Next.js + Clerk + Supabase sur [Vercel](https://vercel.com).

## Prérequis

- Compte [GitHub](https://github.com) (ou GitLab / Bitbucket)
- Projet **Supabase** configuré (`supabase/migrations/001_initial.sql` + bucket `candidate-documents`)
- Application **Clerk** créée

## 1. Pousser le code sur Git

```bash
git init
git add .
git commit -m "CRM F2M v1"
git remote add origin https://github.com/VOTRE_ORG/f2m-crm.git
git push -u origin main
```

## 2. Importer sur Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
2. Sélectionner le dépôt `f2m`
3. Framework : **Next.js** (détecté automatiquement)
4. Ne pas modifier la commande de build : `next build`

## 3. Variables d’environnement (Vercel)

Dans **Project → Settings → Environment Variables**, ajouter **toutes** les variables pour **Production**, **Preview** et **Development** :

| Variable | Où la trouver | Notes |
|----------|---------------|--------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk → API Keys | `pk_live_...` en prod |
| `CLERK_SECRET_KEY` | Clerk → API Keys | `sk_live_...` en prod — **jamais côté client** |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | — | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | — | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | — | `/admin` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | — | `/admin` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API | |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API | **Secret** — serveur uniquement |
| `NEXT_PUBLIC_APP_URL` | Votre domaine | **Important** — voir ci-dessous |

### `NEXT_PUBLIC_APP_URL` (obligatoire en production)

URL **canonique** utilisée pour les liens candidature envoyés par SMS / mail.

Exemples :

- Premier déploiement : `https://f2m-crm.vercel.app`
- Domaine custom : `https://crm.f2mconsulting.fr`

Sans cette variable, l’app utilise `VERCEL_URL` (OK pour tester, mais change à chaque preview).

## 4. Configurer Clerk pour Vercel

Dans [Clerk Dashboard](https://dashboard.clerk.com) → votre app → **Domains** :

1. Ajouter le domaine Vercel : `f2m-crm.vercel.app`
2. Ajouter le domaine custom si vous en avez un

**Paths** (souvent auto) :

- Sign-in URL : `https://VOTRE-DOMAINE/sign-in`
- Sign-up URL : `https://VOTRE-DOMAINE/sign-up`
- After sign-in : `https://VOTRE-DOMAINE/admin`

Créer au moins un compte admin (invitation ou inscription selon vos réglages Clerk).

## 5. Supabase (rien de spécial pour Vercel)

- Pas besoin d’autoriser une IP : les Server Actions / API routes appellent Supabase depuis les fonctions Vercel avec la **service role key**.
- Vérifier que le bucket Storage `candidate-documents` existe (privé).

## 6. Déployer

1. **Deploy** sur Vercel
2. Ouvrir l’URL de production → `/sign-in` → connexion admin
3. `/admin` → **Générer un lien** → vérifier que l’URL commence par `NEXT_PUBLIC_APP_URL`

## 7. Domaine personnalisé (optionnel)

1. Vercel → **Project → Settings → Domains**
2. Ajouter `crm.f2mconsulting.fr` (ou autre)
3. Suivre les instructions DNS (chez le registrar du domaine F2M)
4. Mettre à jour `NEXT_PUBLIC_APP_URL` avec le nouveau domaine
5. **Redeploy** (ou attendre le redeploy auto)
6. Ajouter le même domaine dans **Clerk → Domains**

## Limites Vercel à connaître

| Sujet | Détail |
|--------|--------|
| Taille requête API | ~4,5 Mo max par envoi (plan Hobby) — limiter la taille des PDF / photos |
| Durée fonction | Upload candidature : 60 s max (`vercel.json`) |
| Secrets | `SUPABASE_SERVICE_ROLE_KEY` et `CLERK_SECRET_KEY` uniquement dans Vercel, pas dans le repo |

## Déploiements suivants

Chaque `git push` sur `main` redéploie automatiquement si le projet Vercel est lié au dépôt.

```bash
git add .
git commit -m "feat: ..."
git push
```

## Dépannage

| Problème | Solution |
|----------|----------|
| Build échoue « module not found » | Lancer `npm install` en local, committer `package-lock.json` |
| Clerk redirect loop | Vérifier domaines Clerk + URLs `NEXT_PUBLIC_CLERK_*` |
| Liens candidature en `localhost` | Définir `NEXT_PUBLIC_APP_URL` sur Vercel puis redeploy |
| Erreur Supabase au runtime | Vérifier les 3 variables Supabase + migration SQL exécutée |
| Upload échoue 413 | Fichiers trop lourds — compresser les PDF |

## CLI Vercel (alternative)

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
vercel --prod
```
