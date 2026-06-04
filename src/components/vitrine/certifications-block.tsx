const BADGES = [
  {
    icon: "Q",
    title: "Qualiopi",
    subtitle: "Certification qualité des actions de formation",
    href: "https://certificat.qualiopi.fr/",
    hrefLabel: "Vérifier la certification Qualiopi",
  },
  {
    icon: "RN",
    title: "RNCP 36654",
    subtitle: "Titre Dirigeant SSP — Niveau 5",
    href: "https://www.francecompetences.fr/recherche/rncp/36654/",
    hrefLabel: "Fiche RNCP 36654 sur France Compétences",
  },
  {
    icon: "CN",
    title: "CNAPS",
    subtitle: "Préparation agrément sécurité privée",
    href: "https://www.cnaps-securite.fr/",
    hrefLabel: "Site officiel du CNAPS",
  },
  {
    icon: "FC",
    title: "France Compétences",
    subtitle: "Répertoire national des certifications",
    href: "https://www.francecompetences.fr/",
    hrefLabel: "Site France Compétences",
  },
] as const;

export function CertificationsBlock() {
  return (
    <section className="proof-premium reveal-on-scroll" aria-labelledby="proof-title">
      <div className="container">
        <div className="section-header">
          <h2 id="proof-title">Certifications &amp; reconnaissance</h2>
          <p>
            Organisme certifié Qualiopi et titre inscrit au Répertoire National des
            Certifications Professionnelles (RNCP 36654).
          </p>
        </div>
        <div className="proof-grid reveal-on-scroll reveal-stagger">
          {BADGES.map((badge) => (
            <article key={badge.title} className="proof-badge">
              <a
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="proof-badge-link"
                aria-label={badge.hrefLabel}
              >
                <div className="proof-badge-icon" aria-hidden="true">
                  {badge.icon}
                </div>
                <h3>{badge.title}</h3>
                <p>{badge.subtitle}</p>
                <span className="proof-badge-more">En savoir plus →</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
