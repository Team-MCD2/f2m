import type { Metadata } from "next";
import { VitrineShell } from "@/components/vitrine/vitrine-shell";
import { F2M_SITE } from "@/lib/vitrine/site-config";

export const metadata: Metadata = {
  title: {
    default: "F2M Consulting | Formation DGESP Toulouse - Sécurité Privée",
    template: "%s | F2M Consulting",
  },
  description:
    "Centre de formation DGESP à Toulouse — Titre RNCP 36654, VAE, financement CPF. F2M Consulting, organisme Qualiopi spécialiste sécurité privée et CNAPS.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: F2M_SITE.name,
  url: F2M_SITE.url,
  email: F2M_SITE.email,
  telephone: F2M_SITE.phoneTel,
  description: F2M_SITE.tagline,
  address: {
    "@type": "PostalAddress",
    streetAddress: F2M_SITE.address.street,
    addressLocality: "Toulouse",
    postalCode: "31100",
    addressCountry: "FR",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: F2M_SITE.name,
  url: F2M_SITE.url,
  telephone: F2M_SITE.phoneTel,
  email: F2M_SITE.email,
  image: `${F2M_SITE.url}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: F2M_SITE.address.street,
    addressLocality: "Toulouse",
    postalCode: "31100",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: F2M_SITE.geo.lat,
    longitude: F2M_SITE.geo.lng,
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Occitanie",
  },
};

export default function VitrineLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <VitrineShell>{children}</VitrineShell>
    </>
  );
}
