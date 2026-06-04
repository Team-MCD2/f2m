# F2M Consulting — CRM

Plateforme de gestion des candidats (certification Dirigeant de sécurité).

**Stack :** Next.js 15 · TypeScript · Tailwind · **Clerk** (auth) · **Supabase** (données)

## Démarrage rapide

```bash
npm install
cp .env.example .env.local
# Renseigner Clerk + Supabase (voir docs/SETUP_CLERK_SUPABASE.md)
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Configuration obligatoire

Suivez le guide détaillé : **[docs/SETUP_CLERK_SUPABASE.md](docs/SETUP_CLERK_SUPABASE.md)**

1. Créer le projet Supabase et exécuter `supabase/schema.sql`
2. Créer l’app Clerk, personnaliser le jeton de session, créer l’admin (`farenogif05@gmail.com`) et le partenaire
3. Remplir `.env.local`

## Parcours utilisateur

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/connexion` | Connexion (UI custom, Clerk en backend) |
| `/deposer-dossier` | Première demande candidat (public) |
| `/admin` | Tableau de bord F2M |
| `/admin/stats` | Statistiques + export **CSV** et **YAML** |
| `/partenaire` | Portail centre de formation |
| `/candidat/[token]` | Espace candidat |

## Exports statistiques

Page `/admin/stats` :

- **Exporter CSV** — liste des candidats acceptés pour la période
- **Exporter YAML** — même données au format YAML
- **Tableau de bord YAML** — agrégats (totaux, parcours, évolution mensuelle)

## Structure

```
src/
├── app/api/          # API REST (Supabase service role + Clerk)
├── lib/supabase/     # Client, requêtes, mappers
├── lib/auth/         # Rôles et session
├── components/auth/  # Formulaire connexion custom
└── data/document-templates.ts  # Catalogue modèles (métier, pas des données candidats)
supabase/schema.sql   # Schéma base de données
```

## Build production

```bash
npm run build
npm start
```

## Vitrine — vidéo hero

La page d’accueil lit `public/videos/hero-f2m.mp4` (fourni dans le dépôt). Pour la remplacer par une vidéo personnalisée, déposez un MP4 au même emplacement (1920×1080 recommandé, &lt; 15 Mo). En secours, le composant charge une vidéo Pexels libre de droits (voir `src/lib/vitrine/videos.ts`).
