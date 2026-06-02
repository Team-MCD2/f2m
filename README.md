# F2M Consulting — Prototype CRM

Prototype de démonstration pour **F2M Consulting** (formation Dirigeant de sécurité, Laurence responsable).  
Aligné sur l’entretien (`transcription.txt`) : priorité **génération automatique de documents** depuis l’interface admin, parcours candidat numérisé, exports CDC en seconde phase.

## Prérequis

- Node.js 18+
- npm

## Installation et lancement

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

> **Windows :** en cas d’erreur `npm install` (fichiers verrouillés), fermer les terminaux sur le projet, supprimer `node_modules`, relancer `npm install`.

## Build production

```bash
npm run build
npm start
```

## Structure des fichiers clés

```
f2m/
├── transcription.txt              # Source besoins client
├── README.md
├── package.json
└── src/
    ├── app/
    │   ├── page.tsx               # Portail d'accueil (liens démo)
    │   ├── admin/
    │   │   ├── page.tsx           # Tableau de bord + listes candidats
    │   │   ├── candidats/[id]/    # Fiche candidat (parcours, docs)
    │   │   ├── documents/
    │   │   │   ├── generer/       # Génération document (MVP prioritaire)
    │   │   │   └── templates/     # Liste des ~10 modèles mock
    │   │   └── stats/             # Tableaux statistiques (mock CDC)
    │   ├── candidat/[token]/      # Portail candidat (bonus démo)
    │   └── partenaire/            # Portail partenaire (bonus démo)
    ├── components/
    │   ├── admin/                 # Liste candidats, stat cards
    │   ├── layout/admin-nav.tsx   # Navigation admin
    │   └── ui/                    # Card, Badge, Button, Input…
    ├── data/
    │   ├── mock.ts                # Candidats & partenaires mock
    │   └── document-templates.ts  # Catalogue modèles documents
    ├── lib/
    │   ├── store.tsx              # État candidats (session)
    │   ├── documents.ts           # Génération HTML imprimable
    │   └── export-stats.ts        # Export CSV stats
    └── types/index.ts             # Types métier
```

## Flux de démo client (recommandé)

1. **Accueil** (`/`) — Présenter les 3 espaces (Admin prioritaire).
2. **Admin — Tableau de bord** (`/admin`) — Compteurs, onglets *Demandes / Acceptés / Refusés*, recherche, actions Accepter/Refuser.
3. **Fiche candidat** — Ex. `/admin/candidats/cand-001` (Jean Dupont) : onglets Infos, Pièces jointes, **Documents générés**, Liens e-learning/Teams.
4. **Génération de documents** (`/admin/documents/generer`) — Choisir candidat + modèle → **Aperçu / Imprimer** (fenêtre HTML pré-remplie) → **Générer** (ajout à l’historique).
5. **Modèles** (`/admin/documents/templates`) — Vue des ~10 documents (4 actifs, reste « Phase 2 »).
6. **Statistiques** (`/admin/stats`) — Tableau période + export CSV (aperçu exports CDC).

*(Optionnel)* Portail candidat `/candidat/fatima-benali` ou partenaire `/partenaire`.

## Points encore mock / simulés

| Élément | État |
|--------|------|
| Données | Mémoire React (rechargement = reset) |
| Documents | HTML imprimable, pas de Word/PDF natif |
| Modèles SARFA, livret 2, grille jury… | Listés, génération « Phase 2 » |
| Exports CDC XML | Non implémentés (CSV stats seulement) |
| Signature électronique | Papier / impression simulée |
| Plateforme e-learning Okyo | Lien mock uniquement |
| Base de données / auth | Absents |

## Stack

Next.js 15 · TypeScript · Tailwind CSS · App Router
