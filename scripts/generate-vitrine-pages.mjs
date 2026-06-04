import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "vitrine-prototype");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "pages.manifest.json"), "utf8")
);

const SITE = {
  url: "https://f2mconsulting.fr",
  name: "F2M Consulting",
};

function breadcrumbs(page) {
  const parts = page.path.split("/").filter(Boolean);
  const crumbs = [{ label: "Accueil", href: "index.html" }];
  let acc = "";
  parts.forEach((p, i) => {
    acc += (i === 0 ? "" : "/") + p;
    const isLast = i === parts.length - 1;
    const label = isLast
      ? page.h1
      : p.replace(/-/g, " ").replace(/\.html$/, "").replace(/index$/, parts[0]);
    crumbs.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href: isLast ? null : acc.includes(".html") ? acc : `${parts.slice(0, i + 1).join("/")}/index.html`,
    });
  });
  return crumbs;
}

function schemaBlock(page) {
  const url = `${SITE.url}${page.canonical}`;
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs(page).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        item: c.href ? `${SITE.url}/${c.href.replace(/^\.\.\//, "").replace("index.html", "")}` : url,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      telephone: "+33647275575",
      email: "contact@f2mconsulting.fr",
    },
  ];
  if (page.schemaType === "course") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Course",
      name: page.h1,
      description: page.description,
      provider: { "@type": "Organization", name: SITE.name },
      courseCode: page.courseCode || "RNCP36654",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "blended",
        location: { "@type": "Place", name: "Toulouse", address: "244 Rte de Seysses, 31100 Toulouse" },
      },
    });
  }
  if (page.schemaType === "person") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Laurence Gilabert",
      jobTitle: "Gérante",
      worksFor: { "@type": "Organization", name: SITE.name },
    });
  }
  if (page.schemaType === "reviews") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: SITE.name,
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "42" },
    });
  }
  return blocks.map((b) => JSON.stringify(b)).join("\n  ");
}

function renderPage(page) {
  const base = page.base || "../";
  const crumbs = breadcrumbs(page);
  const crumbHtml = crumbs
    .map((c) =>
      c.href
        ? `<li><a href="${base}${c.href.replace(/^\.\.\//, "")}">${c.label}</a></li>`
        : `<li aria-current="page">${c.label}</li>`
    )
    .join("\n          ");

  const extraSections =
    page.path.includes("temoignages")
      ? `
        <section class="section">
          <div class="container testimonial-carousel" data-reveal>
            <div class="testimonial-track">
              <div class="testimonial-slide">
                <div class="stars" aria-hidden="true">★★★★★</div>
                <p>« Formation exigeante et formatrice. J'ai obtenu mon titre RNCP avec un accompagnement personnalisé. »</p>
                <p><strong>— Stagiaire DESP, 2024</strong></p>
              </div>
              <div class="testimonial-slide">
                <div class="stars" aria-hidden="true">★★★★★</div>
                <p>« La VAE m'a permis de valoriser 15 ans d'expérience. Équipe disponible à Toulouse et en distanciel. »</p>
                <p><strong>— Dirigeant sécurité privée</strong></p>
              </div>
            </div>
            <div class="carousel-controls">
              <button type="button" data-carousel-prev aria-label="Précédent">‹</button>
              <div class="carousel-dots">
                <button type="button" data-carousel-dot class="is-active" aria-selected="true"></button>
                <button type="button" data-carousel-dot aria-selected="false"></button>
              </div>
              <button type="button" data-carousel-next aria-label="Suivant">›</button>
            </div>
          </div>
        </section>`
      : page.path.includes("chiffres")
        ? `
        <section class="section section-alt">
          <div class="container stats-grid" data-reveal>
            <div class="stat-card"><strong data-count="100" data-suffix="%">0%</strong><span>réussite examen 2024</span></div>
            <div class="stat-card"><strong data-count="95" data-suffix="%">0%</strong><span>très satisfaits</span></div>
            <div class="stat-card"><strong data-count="57" data-suffix="%">0%</strong><span>retour emploi à 6 mois</span></div>
          </div>
        </section>`
        : "";

  return `<!DOCTYPE html>
<html lang="fr" data-base="${base}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
  <meta name="geo.region" content="FR-31" />
  <meta name="geo.placename" content="Toulouse" />
  <meta name="geo.position" content="43.5710;1.4055" />
  <meta name="ICBM" content="43.5710, 1.4055" />
  <link rel="canonical" href="${SITE.url}${page.canonical}" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${page.description}" />
  <meta property="og:url" content="${SITE.url}${page.canonical}" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:type" content="website" />
  <meta name="robots" content="index, follow" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${base}css/styles.css" />
  <script type="application/ld+json">
  ${schemaBlock(page)}
  </script>
</head>
<body>
  <div id="site-header"></div>
  <main id="main">
    <div class="page-hero">
      <div class="container">
        <nav aria-label="Fil d'Ariane">
          <ol class="breadcrumb">${crumbHtml}</ol>
        </nav>
        <h1>${page.h1}</h1>
        <p class="lead" style="color:rgba(255,255,255,0.85)">${page.intro}</p>
      </div>
    </div>
    <section class="section">
      <div class="container content-grid sidebar">
        <article class="prose" data-reveal>
          <p>F2M Consulting accompagne les professionnels et les entreprises à <strong>Toulouse</strong> et en <strong>Occitanie</strong> depuis 2012. Cette page fait partie du prototype multi-pages du nouveau site — le contenu rédactionnel SEO sera enrichi en phase 4 du plan stratégique.</p>
          <h2>Pourquoi choisir F2M ?</h2>
          <ul>
            <li>Organisme certifié <strong>Qualiopi</strong></li>
            <li>Spécialiste du titre <strong>RNCP 36654</strong> — Dirigeant sécurité privée</li>
            <li>Formation initiale et <strong>VAE</strong></li>
            <li>Financement : CPF, OPCO, Pôle emploi</li>
          </ul>
          <h2>Prochaine étape</h2>
          <p>Contactez-nous pour un entretien personnalisé ou déposez votre dossier en ligne.</p>
          <p>
            <a class="btn btn-gold" href="${base}contact.html">Nous contacter</a>
            <a class="btn btn-navy" href="https://f2m-f1yb.vercel.app/deposer-dossier" style="margin-left:0.5rem">Déposer un dossier</a>
          </p>
        </article>
        <aside class="sidebar-box" data-reveal>
          <p class="footer-heading" style="margin-top:0">Besoin d'infos ?</p>
          <p><a href="tel:+33647275575">06 47 27 55 75</a><br /><a href="mailto:contact@f2mconsulting.fr">contact@f2mconsulting.fr</a></p>
          <p>244 Rte de Seysses<br />31100 Toulouse</p>
          <a class="btn btn-gold" href="${base}contact.html" style="width:100%">Prendre RDV</a>
        </aside>
      </div>
    </section>
    ${extraSections}
    <section class="section">
      <div class="container">
        <div class="cta-band" data-reveal>
          <h2>Prêt à avancer sur votre projet ?</h2>
          <p>Échangeons sur vos objectifs de formation ou de conseil.</p>
          <a class="btn btn-gold btn-primary-glow" href="${base}contact.html">Prendre rendez-vous</a>
        </div>
      </div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="${base}js/site-config.js"></script>
  <script src="${base}js/layout.js"></script>
  <script src="${base}js/main.js"></script>
</body>
</html>`;
}

for (const page of manifest) {
  const out = path.join(root, page.path);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, renderPage(page), "utf8");
  console.log("✓", page.path);
}

console.log(`\n${manifest.length} pages générées.`);
