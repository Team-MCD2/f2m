import type { Metadata } from "next";
import { F2M_SITE } from "@/lib/vitrine/site-config";

const GEO_OTHER: Metadata["other"] = {
  "geo.region": "FR-31",
  "geo.placename": "Toulouse",
  "geo.position": `${F2M_SITE.geo.lat};${F2M_SITE.geo.lng}`,
  ICBM: `${F2M_SITE.geo.lat}, ${F2M_SITE.geo.lng}`,
};

/** Metadata géo-localisées pour les pages vitrine clés. */
export function vitrineGeoMetadata(
  path: string,
  options: {
    title: string;
    description: string;
    keywords?: string[];
  },
): Metadata {
  const url = `${F2M_SITE.url}${path}`;
  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url,
      siteName: F2M_SITE.name,
      title: options.title,
      description: options.description,
    },
    other: GEO_OTHER,
  };
}
