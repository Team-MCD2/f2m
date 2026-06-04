import type { Metadata } from "next";
import { VitrineShell } from "@/components/vitrine/vitrine-shell";
import { F2M_SITE } from "@/lib/vitrine/site-config";

const SITE_KEYWORDS = [
  "formation DGESP Toulouse",
  "sécurité privée Toulouse",
  "RNCP 36654",
  "Qualiopi",
  "VAE DGESP",
  "centre formation CNAPS 31",
  "dirigeant entreprise sécurité privée",
  "F2M Consulting",
  "Haute-Garonne",
  "Occitanie",
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(F2M_SITE.url),
  title: {
    default:
      "F2M Consulting | Formation DGESP Toulouse — Sécurité privée · Qualiopi · RNCP 36654",
    template: "%s | F2M Consulting",
  },
  description:
    "Centre de formation DGESP à Toulouse (31100) — Titre RNCP 36654 niveau 5, VAE, financements CPF/OPCO. F2M Consulting, organisme certifié Qualiopi spécialiste sécurité privée et CNAPS en Occitanie.",
  keywords: [...SITE_KEYWORDS],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: F2M_SITE.url,
    siteName: F2M_SITE.name,
    title: "F2M Consulting — Formation DGESP & sécurité privée à Toulouse",
    description:
      "Organisme Qualiopi à Toulouse : formation DGESP RNCP 36654, VAE, e-learning Dokeos. 244 Route de Seysses, 31100 Toulouse.",
    images: [
      {
        url: F2M_SITE.logoUrl,
        width: 560,
        height: 160,
        alt: "Logo F2M Consulting — formation sécurité privée Toulouse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "F2M Consulting — Formation DGESP Toulouse",
    description:
      "Centre Qualiopi · RNCP 36654 · VAE · sécurité privée — 244 Route de Seysses, 31100 Toulouse.",
    images: [F2M_SITE.logoUrl],
  },
  icons: {
    icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }, { url: F2M_SITE.logo, type: "image/png" }],
    apple: [{ url: F2M_SITE.logo, type: "image/png" }],
  },
  other: {
    "geo.region": "FR-31",
    "geo.placename": "Toulouse",
    "geo.position": `${F2M_SITE.geo.lat};${F2M_SITE.geo.lng}`,
    ICBM: `${F2M_SITE.geo.lat}, ${F2M_SITE.geo.lng}`,
  },
};

const addressJsonLd = {
  "@type": "PostalAddress",
  streetAddress: F2M_SITE.address.street,
  addressLocality: "Toulouse",
  postalCode: "31100",
  addressRegion: "Occitanie",
  addressCountry: "FR",
};

const educationalOrganizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "Organization"],
  "@id": `${F2M_SITE.url}/#organization`,
  name: F2M_SITE.name,
  url: F2M_SITE.url,
  logo: F2M_SITE.logoUrl,
  image: F2M_SITE.logoUrl,
  email: F2M_SITE.email,
  telephone: F2M_SITE.phoneTel,
  description: F2M_SITE.tagline,
  address: addressJsonLd,
  geo: {
    "@type": "GeoCoordinates",
    latitude: F2M_SITE.geo.lat,
    longitude: F2M_SITE.geo.lng,
  },
  areaServed: [
    { "@type": "City", name: "Toulouse" },
    { "@type": "AdministrativeArea", name: "Haute-Garonne" },
    { "@type": "AdministrativeArea", name: "Occitanie" },
  ],
  knowsAbout: [
    "Formation DGESP",
    "Sécurité privée",
    "RNCP 36654",
    "VAE",
    "Qualiopi",
  ],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${F2M_SITE.url}/#localbusiness`,
  name: F2M_SITE.name,
  url: F2M_SITE.url,
  logo: F2M_SITE.logoUrl,
  image: F2M_SITE.logoUrl,
  telephone: F2M_SITE.phoneTel,
  email: F2M_SITE.email,
  priceRange: "$$",
  address: addressJsonLd,
  geo: {
    "@type": "GeoCoordinates",
    latitude: F2M_SITE.geo.lat,
    longitude: F2M_SITE.geo.lng,
  },
  areaServed: [
    { "@type": "City", name: "Toulouse" },
    { "@type": "AdministrativeArea", name: "Haute-Garonne" },
    { "@type": "AdministrativeArea", name: "Occitanie" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
};

export default function VitrineLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalOrganizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <VitrineShell>{children}</VitrineShell>
    </>
  );
}

