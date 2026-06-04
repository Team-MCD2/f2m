import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/vitrine/section";
import { F2M_SITE } from "@/lib/vitrine/site-config";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <Section variant="light" className="legal-page">
      <div className="prose">
        <h1>Politique de confidentialité</h1>
        <p>
          {F2M_SITE.name} s&apos;engage à protéger les données personnelles collectées via ce
          site et le formulaire de contact.
        </p>
        <h2>Données collectées</h2>
        <p>
          Nom, email, téléphone et informations relatives à votre projet de formation — uniquement
          avec votre consentement explicite.
        </p>
        <h2>Finalité</h2>
        <p>Réponse à vos demandes, suivi de candidature et information sur nos formations DGESP.</p>
        <h2>Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et
          de suppression en contactant{" "}
          <a href={`mailto:${F2M_SITE.email}`}>{F2M_SITE.email}</a>.
        </p>
        <p><Link href="/">Retour à l&apos;accueil</Link></p>
      </div>
    </Section>
  );
}
