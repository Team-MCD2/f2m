const BADGES = [
  { icon: "Q", title: "Qualiopi", subtitle: "Processus certifié" },
  { icon: "RN", title: "RNCP 36654", subtitle: "Niveau 5 · DGESP" },
  { icon: "CN", title: "CNAPS", subtitle: "Préparation agrément" },
  { icon: "FC", title: "France Compétences", subtitle: "Titre professionnel" },
] as const;

export function CertificationsBlock() {
  return (
    <section className="proof-premium reveal-on-scroll" aria-labelledby="proof-title">
      <div className="container">
        <div className="section-header">
          <h2 id="proof-title">Certifications &amp; reconnaissance</h2>
          <p>
            Organisme certifié et titre inscrit au Répertoire National des
            Certifications Professionnelles.
          </p>
        </div>
        <div className="proof-grid reveal-on-scroll reveal-stagger">
          {BADGES.map((badge) => (
            <article key={badge.title} className="proof-badge">
              <div className="proof-badge-icon" aria-hidden="true">
                {badge.icon}
              </div>
              <h3>{badge.title}</h3>
              <p>{badge.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
