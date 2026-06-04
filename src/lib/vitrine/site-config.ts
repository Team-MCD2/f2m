export const F2M_SITE = {
  url: "https://f2mconsulting.fr",
  name: "F2M Consulting",
  tagline: "Centre de formation · Cabinet conseil · Toulouse · Qualiopi",
  phone: "06 47 27 55 75",
  phoneTel: "+33647275575",
  email: "contact@f2mconsulting.fr",
  address: {
    street: "244 Route de Seysses, Bât.1, 1er étage",
    city: "31100 Toulouse",
    full: "244 Route de Seysses, Bât.1, 1er étage, 31100 Toulouse",
  },
  geo: { lat: 43.566, lng: 1.4028 },
  lmsUrl: "https://lmsdokeos.f2mconsulting.fr",
  depositUrl: "/deposer-dossier",
  keywords:
    "formation sécurité privée toulouse, DGESP toulouse, centre formation CNAPS 31",
  mapsEmbed:
    "https://maps.google.com/maps?q=244+Route+de+Seysses,+B%C3%A2t.1,+1er+%C3%A9tage,+31100+Toulouse,+France&ll=43.5660,1.4028&z=16&hl=fr&ie=UTF8&output=embed",
  mapsPlaceUrl:
    "https://www.google.com/maps/search/?api=1&query=244+Route+de+Seysses,+B%C3%A2t.1,+1er+%C3%A9tage,+31100+Toulouse&center=43.5660%2C1.4028",
  mapsOsmEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=1.3928%2C43.5600%2C1.4128%2C43.5720&layer=mapnik&marker=43.5660%2C1.4028",
} as const;

export type VitrineNavLink = {
  label: string;
  href: string;
  highlight?: boolean;
};

export type VitrineNavGroup = {
  label: string;
  children: readonly VitrineNavLink[];
};

export type VitrineNavItem = VitrineNavLink | VitrineNavGroup;

export function isNavGroup(item: VitrineNavItem): item is VitrineNavGroup {
  return "children" in item;
}

export const VITRINE_NAV: readonly VitrineNavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Notre Centre", href: "/notre-centre" },
  {
    label: "Formations",
    children: [
      { label: "Formation DGESP", href: "/formation-dgesp", highlight: true },
      { label: "VAE DGESP", href: "/vae-dgesp" },
    ],
  },
  { label: "Financements", href: "/financements" },
  { label: "Blog", href: "/blog" },
  { label: "E-learning", href: "/e-learning" },
  {
    label: "Espace candidat",
    children: [
      { label: "Déposer un dossier", href: "/deposer-dossier" },
      { label: "Connexion", href: "/connexion" },
    ],
  },
];

export const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-confidentialite" },
  { label: "CGV", href: "/cgv" },
] as const;

export const MICRODIDACT = {
  label: "Développé par Microdidact",
  url: "https://microdidact.com/",
} as const;
