# Configuration Clerk + Supabase — F2M Consulting

Guide pas à pas pour connecter l’application aux services réels.

---

## Partie 1 — Supabase (base de données)

### Étape 1.1 — Créer le projet

1. Allez sur [https://supabase.com](https://supabase.com) et connectez-vous.
2. Cliquez sur **New project**.
3. Choisissez un nom (ex. `f2m-crm`), un mot de passe base de données, une région (ex. `West EU`).
4. Attendez la fin du provisionnement (~2 min).

### Étape 1.2 — Exécuter le schéma SQL

1. Dans le menu gauche : **SQL Editor** → **New query**.
2. Copiez tout le contenu du fichier `supabase/schema.sql` à la racine du projet.
3. Cliquez sur **Run**.
4. Vérifiez dans **Table Editor** que les tables existent : `partenaires`, `profiles`, `candidats`, `documents_generes`.

### Étape 1.3 — Récupérer les clés API

1. Menu **Project Settings** (engrenage) → **API**.
2. Notez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optionnel pour plus tard)
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`  
     ⚠️ Ne jamais exposer la clé `service_role` côté navigateur.

### Étape 1.4 — Noter l’ID du partenaire (pour Clerk)

1. **Table Editor** → table `partenaires`.
2. Copiez l’**UUID** de la ligne « Centre Formation Marseille Sud » (colonne `id`).
3. Vous en aurez besoin pour le compte partenaire dans Clerk (`partenaire_id`).

---

## Partie 2 — Clerk (authentification)

L’interface de connexion du site (`/connexion`) est **conservée** : elle utilise l’API Clerk en arrière-plan (`useSignIn`), pas les composants visuels Clerk.

### Étape 2.1 — Créer l’application Clerk

1. [https://dashboard.clerk.com](https://dashboard.clerk.com) → **Add application**.
2. Nom : `F2M CRM`.
3. Choisissez **Email** et **Password** comme méthodes de connexion.
4. Validez la création.

### Étape 2.2 — Variables d’environnement Clerk

1. **API Keys** dans Clerk.
2. Copiez dans `.env.local` :
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/connexion
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/admin
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/admin
   ```

### Étape 2.3 — Personnaliser le jeton de session (obligatoire)

Sans cette étape, le middleware ne connaît pas le rôle utilisateur.

1. Clerk Dashboard → **Sessions** → **Customize session token**.
2. Collez ce JSON :

```json
{
  "metadata": {
    "role": "{{user.public_metadata.role}}",
    "candidat_token": "{{user.public_metadata.candidat_token}}",
    "partenaire_id": "{{user.public_metadata.partenaire_id}}"
  }
}
```

3. **Save**.

### Étape 2.4 — Créer le compte administrateur

1. **Users** → **Create user**.
2. E-mail : `dev@microdidact.com`
3. Mot de passe : celui de votre choix (ex. `microdidact` en dev uniquement).
4. Après création, ouvrez l’utilisateur → **Public metadata** → **Edit** :

```json
{
  "role": "admin"
}
```

5. **Save**.

### Étape 2.5 — Créer le compte partenaire

1. **Create user**.
2. E-mail : `contact@cf-marseille-sud.fr` (identique à la table `partenaires`).
3. Mot de passe : au choix (ex. communiqué au centre).
4. **Public metadata** :

```json
{
  "role": "partenaire",
  "partenaire_id": "COLLER-ICI-L-UUID-SUPABASE-DU-PARTENAIRE"
}
```

### Étape 2.6 — Comptes candidats

Les candidats sont créés **automatiquement** lors du dépôt de dossier (`/deposer-dossier`) :

- Un enregistrement Supabase est créé.
- Un utilisateur Clerk est créé avec `role: "candidat"` et `candidat_token: "prenom-nom"`.
- Connexion ensuite via l’onglet **Candidat** avec l’**identifiant personnel** (token), sans mot de passe affiché (ticket Clerk).

### Étape 2.7 — URLs autorisées (local + production)

1. **Paths** ou **Domains** selon la version Clerk :
   - `http://localhost:3000`
   - Votre domaine Vercel (ex. `https://f2m-xxx.vercel.app`)
2. **Allowed redirect URLs** : ajoutez `/admin`, `/partenaire`, `/candidat/*`.

---

## Partie 3 — Fichier `.env.local` complet

Créez `f2m/.env.local` :

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/connexion
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/admin
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/admin

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Redémarrez le serveur : `npm run dev`.

---

## Partie 4 — Vercel (déploiement)

1. Projet Vercel → **Settings** → **Environment Variables**.
2. Ajoutez **toutes** les variables ci-dessus (Production + Preview).
3. Redéployez.
4. Dans Clerk, ajoutez l’URL de production aux domaines autorisés.

---

## Partie 5 — Vérifications

| Test | Action attendue |
|------|-----------------|
| Admin | `/connexion` → onglet Admin → `dev@microdidact.com` → `/admin` |
| Partenaire | Onglet Partenaire → e-mail centre → `/partenaire` |
| Nouveau candidat | `/deposer-dossier` → soumettre → noter l’identifiant |
| Candidat connecté | `/connexion` → onglet Candidat → identifiant → `/candidat/...` |
| Stats | `/admin/stats` → chiffres depuis Supabase, exports CSV + YAML |

---

## Dépannage

- **« Profil introuvable »** : vérifiez `publicMetadata.role` et le jeton de session (étape 2.3).
- **Redirection en boucle** : le rôle dans Clerk ne correspond pas à l’espace demandé.
- **Candidat : compte non activé** : le dossier existe mais `clerk_user_id` est vide (échec création Clerk à la soumission).
- **Erreur Supabase** : vérifiez `SUPABASE_SERVICE_ROLE_KEY` et que le schéma SQL a bien été exécuté.
