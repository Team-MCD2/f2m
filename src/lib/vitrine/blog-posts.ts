import { VITRINE_IMAGES } from "./images";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  image: string;
  imageFallback: string;
  imageAlt: string;
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cnaps-agrement-2025",
    title: "Comment obtenir l'agrément CNAPS en 2025 ?",
    excerpt: "Étapes, délais et pièces pour le dirigeant d'entreprise SSP.",
    date: "2025-01-15",
    dateLabel: "15 janv. 2025",
    image: VITRINE_IMAGES.blogPosts.cnaps,
    imageFallback: VITRINE_IMAGES.blogPosts.cnaps,
    imageAlt: "Agrément CNAPS et réglementation sécurité privée",
    content: [
      "L'agrément CNAPS est obligatoire pour exercer en tant que dirigeant d'entreprise de sécurité privée. En 2025, les démarches restent centralisées sur la plateforme en ligne du CNAPS.",
      "Préparez votre dossier : extrait Kbis, attestation de formation ou titre DGESP, casier judiciaire, assurance RC Pro et justificatifs d'honorabilité. Les délais varient selon la complétude du dossier.",
      "F2M Consulting accompagne les candidats DGESP dans la préparation réglementaire et la structuration du dossier dirigeant.",
    ],
  },
  {
    slug: "gardiennage-vs-protection-rapprochee",
    title: "Gardiennage vs protection rapprochée",
    excerpt: "Cadre légal, formations et agréments distincts.",
    date: "2025-02-10",
    dateLabel: "10 fév. 2025",
    image: VITRINE_IMAGES.blogPosts.gardiennage,
    imageFallback: VITRINE_IMAGES.blogPosts.gardiennageFallback,
    imageAlt: "Agent de sécurité en gardiennage et protection rapprochée",
    content: [
      "Le gardiennage-surveillance vise la protection des biens et des personnes dans un cadre défini (sites, entrepôts, ERP). La protection rapprochée concerne l'accompagnement rapproché de personnes exposées — cadre réglementaire et cartes professionnelles distincts.",
      "Le dirigeant DGESP doit maîtriser l'organisation des deux activités lorsqu'elles sont déclarées au sein de la même structure.",
    ],
  },
  {
    slug: "cpf-securite-privee",
    title: "CPF sécurité privée : utiliser vos droits",
    excerpt: "Financer le DGESP avec le Compte Personnel de Formation.",
    date: "2025-03-05",
    dateLabel: "5 mars 2025",
    image: VITRINE_IMAGES.blogPosts.cpf,
    imageFallback: VITRINE_IMAGES.blogPosts.cpfFallback,
    imageAlt: "Financement formation sécurité privée avec le CPF",
    content: [
      "Le Compte Personnel de Formation (CPF) permet de financer tout ou partie de la formation DGESP, sous réserve de vos droits acquis et de l'éligibilité de la formation sur Mon Compte Formation.",
      "F2M Consulting vous accompagne dans le montage du dossier : devis, convention, calendrier et dépôt sur la plateforme CPF.",
    ],
  },
  {
    slug: "convention-collective-3196",
    title: "Convention collective 3196 expliquée",
    excerpt: "IDCC 1351 — salaires, classifications et obligations employeur.",
    date: "2025-04-01",
    dateLabel: "1 avr. 2025",
    image: VITRINE_IMAGES.blogPosts.convention,
    imageFallback: VITRINE_IMAGES.blogPosts.convention,
    imageAlt: "Documents convention collective sécurité privée",
    content: [
      "La convention collective nationale des entreprises de gardiennage, de surveillance et de protection (IDCC 1351, souvent appelée 3196) encadre les relations de travail dans la sécurité privée.",
      "Le dirigeant DGESP doit connaître les grilles de rémunération, les classifications agents et les obligations employeur pour piloter son entreprise en conformité.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
