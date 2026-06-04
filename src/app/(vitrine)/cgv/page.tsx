import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/vitrine/section";
import { F2M_SITE } from "@/lib/vitrine/site-config";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false, follow: true },
};

export default function CgvPage() {
  return (
    <Section variant="light" className="legal-page">
      <div className="prose">
        <h1>Conditions générales de vente</h1>
        <p>
          Les présentes CGV régissent les prestations de formation proposées par {F2M_SITE.name},
          organisme certifié Qualiopi, au {F2M_SITE.address.full}.
        </p>
        <h2>Inscription</h2>
        <p>
          Toute inscription est confirmée après entretien de positionnement, signature de la
          convention de formation et validation du financement le cas échéant.
        </p>
        <h2>Annulation</h2>
        <p>
          Les conditions d&apos;annulation et de report sont précisées dans la convention de
          formation remise à chaque stagiaire.
        </p>
        <h2>Contact</h2>
        <p>
          <a href={`tel:${F2M_SITE.phoneTel}`}>{F2M_SITE.phone}</a> —{" "}
          <a href={`mailto:${F2M_SITE.email}`}>{F2M_SITE.email}</a>
        </p>
        <p><Link href="/">Retour à l&apos;accueil</Link></p>
      </div>
    </Section>
  );
}
