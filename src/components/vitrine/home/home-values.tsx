import { Section } from "@/components/vitrine/section";

const VALUES = [
  {
    title: "Exigence",
    text: "Pédagogie structurée, suivi individualisé et préparation rigoureuse aux épreuves du titre DGESP.",
  },
  {
    title: "Proximité",
    text: "Équipe à taille humaine à Toulouse, disponible avant, pendant et après votre parcours de formation.",
  },
  {
    title: "Éthique",
    text: "Accompagnement conforme aux exigences CNAPS et aux bonnes pratiques du secteur de la sécurité privée.",
  },
  {
    title: "Qualiopi",
    text: "Organisme certifié — processus qualité audités pour la formation et la VAE éligibles aux financements publics.",
  },
] as const;

export function HomeValues() {
  return (
    <Section
      id="valeurs"
      variant="navy"
      title="Nos valeurs"
      subtitle="Ce qui guide F2M Consulting au quotidien auprès des dirigeants et professionnels que nous formons."
      className="reveal-on-scroll"
    >
      <div className="home-values-grid">
        {VALUES.map((value) => (
          <article key={value.title} className="home-value-card">
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
