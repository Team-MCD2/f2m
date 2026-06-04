import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/vitrine/section";
import { F2M_SITE } from "@/lib/vitrine/site-config";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <Section variant="light" className="legal-page">
      <div className="prose">
        <h1>Mentions légales</h1>
        <h2>Éditeur</h2>
        <p>
          <strong>{F2M_SITE.name}</strong>
          <br />
          {F2M_SITE.address.full}
          <br />
          Tél : <a href={`tel:${F2M_SITE.phoneTel}`}>{F2M_SITE.phone}</a> —{" "}
          <a href={`mailto:${F2M_SITE.email}`}>{F2M_SITE.email}</a>
        </p>
        <h2>Hébergement</h2>
        <p>À compléter lors de la mise en production (hébergeur du site vitrine).</p>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu de ce site est protégé. Toute reproduction sans autorisation
          est interdite.
        </p>
        <p><Link href="/">Retour à l&apos;accueil</Link></p>
      </div>
    </Section>
  );
}
