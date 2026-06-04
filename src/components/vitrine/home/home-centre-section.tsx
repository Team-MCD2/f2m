import Link from "next/link";
import { Section } from "@/components/vitrine/section";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { TOULOUSE_IMAGE } from "@/lib/vitrine/images";

export function HomeCentreSection() {
  return (
    <Section
      id="notre-centre-toulouse"
      variant="light"
      className="section--align-left"
      title="Notre centre à Toulouse"
      subtitle="Locaux modernes à deux pas du périphérique sud — formation présentielle et distanciel complémentaires."
    >
      <div className="media-band home-centre-band">
        <div>
          <p>
            F2M Consulting accueille dirigeants et professionnels de la sécurité privée
            depuis 2012. Salles équipées, classes virtuelles et accompagnement
            individualisé pour la réussite au titre DGESP.
          </p>
          <p>
            <Link className="btn btn-gold" href="/notre-centre">
              Découvrir notre centre
            </Link>
          </p>
        </div>
        <div className="media-band-img-wrap">
          <VitrineImage
            src={TOULOUSE_IMAGE}
            fallback={TOULOUSE_IMAGE}
            alt="Vue de Toulouse — Garonne et centre-ville, ville d'accueil F2M Consulting"
            width={800}
            height={600}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>
    </Section>
  );
}
