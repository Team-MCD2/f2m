# Besoins client — F2M (notes Sofian, 03/06/2026)

> Document de référence pour ne rien perdre. À mettre à jour après chaque échange client.
> **Priorité explicite du client : l’interface admin.** L’interface élève reste volontairement minimale pour l’instant.

---

## 1. Vision globale

| Acteur | Rôle |
|--------|------|
| **Admin F2M** | Interface riche : tableau de bord, profils élèves, gestion documents, stats, exports |
| **Élève / candidat** | Interface **très simple** : uniquement « Mes documents » + glisser-déposer |
| **Partenaire** | (Hors message du 03/06 — à confirmer si inchangé) |

Chaque **élève a un profil** unique. Ce profil centralise **toutes ses informations** et **tous ses documents** (ceux qu’il envoie + ceux que l’admin lui envoie + ceux générés automatiquement).

---

## 2. Interface élève (candidat) — MVP demandé

### Ce qu’il doit y avoir (pour l’instant)

- **Rien d’autre** que :
  1. **« Mes documents »** — liste de tous les documents disponibles pour l’élève
  2. **Zone glisser-déposer** — pour déposer des fichiers

### Ce qu’il ne doit **pas** avoir (pour l’instant)

- Pas de menu complexe, pas de stats, pas de fiche à remplir dans le portail connecté (le dépôt initial de dossier peut rester ailleurs — voir questions)
- L’élève **ne clique nulle part** pour recevoir les documents « spéciaux » générés par F2M : ils **apparaissent automatiquement** dans « Mes documents »

### Flux documents côté élève

```
Élève ouvre son espace
    → voit la liste de TOUS ses documents
    → peut glisser-déposer de nouveaux fichiers
    → les fichiers uploadés sont visibles côté admin sur le profil de l’élève
```

---

## 3. Interface admin — priorité maximale

### Profil élève (fiche candidat)

Pour **chaque élève**, l’admin accède à un **profil** contenant :

- **Toutes les informations** de l’élève (identité, parcours, statut, dates, etc.)
- **Tous les documents** liés à cet élève :
  - documents **uploadés par l’élève** (depuis son interface)
  - documents **déposés par l’admin** sur le profil (glisser-déposer admin)
  - documents **générés automatiquement** (modèles F2M / « documents spéciaux » client)

### Actions admin sur les documents

- **Glisser-déposer** des fichiers sur le profil élève
- Les documents déposés par l’admin doivent être **immédiatement accessibles** dans l’interface élève (« Mes documents »)
- Voir / prévisualiser les documents reçus de l’élève

### Tableau de bord admin (déjà en cours côté dev)

- Grand tableau type Excel, exports **CSV** et **YML**
- Stats / indicateurs sur la même page
- Connexion unique avec détection de rôle
- Qualité UI soignée — **c’est la partie la plus importante pour le client**

---

## 4. Documents « spéciaux » / génération automatique

### Besoin

Quand le **client F2M** fournit des **modèles de documents spéciaux** (templates) :

1. Ces modèles sont intégrés dans le système
2. Pour **chaque élève**, les documents concernés se **génèrent automatiquement**
3. L’élève **n’a aucune action à faire** — les fichiers sont **déjà disponibles** dans « Mes documents »
4. L’admin peut aussi les voir sur le profil élève

### À clarifier avec le client

- **Quand** se déclenche la génération ? (à l’acceptation du dossier ? à une date ? manuellement par l’admin en lot ?)
- **Quels** champs du profil alimentent chaque template ?
- Format de sortie attendu : **PDF** ? Word ? les deux ?
- Liste exacte des « documents spéciaux » à prévoir en v1

### État actuel du code (référence)

- Génération **HTML + impression navigateur** (`src/lib/documents.ts`, boutons sur fiche admin)
- Table `documents_generes` : métadonnées seulement, **pas de fichier stocké** (pas d’URL, pas de Storage)
- **Pas encore** de pipeline « template client → PDF auto → visible élève »

---

## 5. Stockage fichiers — Cloudinary vs Supabase

### Consignes client (Sofian)

| Outil | Usage prévu |
|-------|-------------|
| **Cloudinary** | Fichiers non-PDF (images, etc.) — **Cloudinary bloque les PDF** |
| **Supabase Storage** | PDF en priorité si ça fonctionne directement |
| **Règle** | Système de **reconnaissance du type** : PDF → Supabase ; autre → Cloudinary |
| **PDF sur Cloudinary** | Si impossible en PDF natif : **conversion en PNG** pour prévisualisation |
| **Décision technique** | Tester les deux et choisir **la meilleure expérience** pour le client final |

### Comportement attendu (cible)

```
Upload fichier
    → détection MIME / extension
    → si PDF  → bucket Supabase (+ URL signée ou publique selon sécurité)
    → sinon   → Cloudinary
    → enregistrement en BDD : candidat_id, nom, source (eleve|admin|genere), url, mime, uploaded_at
```

### État actuel du code

- **Aucune** intégration Cloudinary
- **Aucun** bucket Supabase Storage configuré dans le repo
- Uploads candidat simulés (`uploaded[id] = true` sans vrai fichier — `portail-form.tsx`, `checklist.ts`)

---

## 6. Modèle de données à prévoir (proposition)

Nouvelle table suggérée : `documents_fichiers` (nom à valider)

| Colonne | Description |
|---------|-------------|
| `id` | UUID |
| `candidat_id` | FK candidats |
| `nom_fichier` | Nom original |
| `storage` | `supabase` \| `cloudinary` |
| `storage_path` / `public_id` | Référence selon provider |
| `url` | URL d’accès (ou reconstruite à la volée) |
| `mime_type` | |
| `source` | `eleve` \| `admin` \| `auto_genere` |
| `template_type` | nullable, si document généré depuis un modèle |
| `uploaded_by` | clerk_user_id ou rôle |
| `created_at` | |

Les **documents générés** actuels (`documents_generes`) pourraient être fusionnés ou liés à cette table avec une vraie URL de fichier.

---

## 7. Écarts : aujourd’hui → cible

| Fonctionnalité | Aujourd’hui | Cible client |
|----------------|-------------|--------------|
| Portail élève connecté | Résumé statut + message « dossier déjà enregistré » | **Mes documents** + drag & drop uniquement |
| Upload réel | Factice (cases cochées) | Fichiers réels, stockés, listés |
| Profil admin documents | Liste métadonnées « documents générés », pas de fichiers uploadés | Zone drop admin + liste complète + preview |
| Sync admin → élève | N/A | Immédiat dans « Mes documents » |
| Sync élève → admin | N/A | Visible sur profil admin |
| Génération auto | Manuelle (bouton + print) | Auto pour chaque élève, sans clic élève |
| Cloudinary / Supabase | Absent | Routage intelligent par type |

---

## 8. Ordre de développement suggéré

1. **Schéma BDD + API upload** (Supabase Storage + Cloudinary + détection type)
2. **Profil admin** : section documents avec drop zone + liste fichiers
3. **Interface élève** : page minimaliste Mes documents + drop zone
4. **Génération automatique** : une fois les templates client reçus
5. **Finitions admin** (tableau de bord, exports — déjà avancé)

---

## 9. Questions ouvertes (à poser au client / Sofian)

1. **Dépôt de dossier initial** : reste-t-il sur `/deposer-dossier` (public) avec checklist complète, et le portail connecté `/candidat/[token]` ne sert qu’aux documents après inscription ?
2. **Types de fichiers autorisés** : PDF seulement ? Images ? Word ? Taille max ?
3. **Suppression** : l’admin ou l’élève peut-il supprimer un document ? Qui ?
4. **Documents générés** : remplacent-ils l’impression manuelle actuelle ou s’ajoutent-ils ? Faut-il archiver chaque version ?
5. **Notification** : l’élève doit-il être notifié (email) quand l’admin ajoute un document ou qu’un doc auto est généré ?
6. **Partenaire** : le centre peut-il aussi déposer des docs sur le profil, ou **admin + élève seulement** ?
7. **Sécurité** : URLs signées temporaires vs liens permanents pour les téléchargements ?
8. **Templates « spéciaux »** : le client les fournit en quel format (Word, PDF vierge, champs nom/prénom) et à quelle date pour la v1 ?

---

## 9. Résumé en une phrase

> **Un profil par élève**, documents **visibles des deux côtés** (upload admin + upload élève), **génération auto** des docs F2M sans action élève, stockage **PDF → Supabase / reste → Cloudinary**, interface élève **minimaliste**, interface admin **complète et soignée**.

---

## 10. Journal des échanges

| Date | Source | Contenu |
|------|--------|---------|
| 03/06/2026 | Sofian (WhatsApp) | Interface élève = Mes documents + drag & drop ; profil admin avec toutes les infos et docs ; sync bidirectionnelle ; génération auto des docs spéciaux ; Cloudinary sauf PDF ; PDF → Supabase ou PNG ; admin = priorité |
| 03/06/2026 | Dev | Implémenté : table `documents_fichiers`, upload Supabase/Cloudinary, portail élève, onglet Documents admin, génération auto à l’acceptation — voir `docs/SETUP_DOCUMENTS.md` |

*Dernière mise à jour : 03/06/2026*
