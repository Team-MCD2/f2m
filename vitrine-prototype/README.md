# F2M Consulting — Site vitrine (prototype HTML)

Site statique navigable localement : 8 pages principales + blog + pages légales.

## Ouvrir en local

### Option 1 — Extension Live Server (VS Code / Cursor)
Ouvrir `index.html` avec Live Server (racine = ce dossier).

### Option 2 — Python
```bash
cd vitrine-prototype
python -m http.server 8080
```
Puis : http://localhost:8080/

### Option 3 — Node
```bash
npx serve vitrine-prototype
```

## Structure

| URL cible | Fichier |
|-----------|---------|
| `/` | `index.html` |
| `/notre-centre/` | `notre-centre/index.html` |
| `/formation-dgesp/` | `formation-dgesp/index.html` |
| `/vae-dgesp/` | `vae-dgesp/index.html` |
| `/financements/` | `financements/index.html` |
| `/blog/` | `blog/index.html` |
| `/contact/` | `contact/index.html` |
| `/e-learning/` | `e-learning/index.html` |

## Assets à ajouter

Placer dans `assets/` :
- `hero-bg.mp4` + `hero-poster.webp` (hero accueil)
- `og-f2m-1200x630.jpg` (Open Graph)
- `programme-dgesp.pdf`, `guide-vae-dgesp.pdf`

## Déploiement

Servir ce dossier en statique sur `f2mconsulting.fr` (Vercel, Netlify, ou hébergement classique). Le CRM Next.js reste séparé.
