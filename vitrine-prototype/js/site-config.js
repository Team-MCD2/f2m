/** Configuration globale F2M Consulting — vitrine statique */
window.F2M_SITE = {
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
  depositUrl: "https://f2m-f1yb.vercel.app/deposer-dossier",
  ogImage: "https://f2mconsulting.fr/assets/og-f2m-1200x630.jpg",
  /** Embed Google Maps valide (coords + adresse) — pas de place_id fictif */
  mapsEmbed:
    "https://maps.google.com/maps?q=244+Route+de+Seysses,+B%C3%A2t.1,+1er+%C3%A9tage,+31100+Toulouse,+France&ll=43.5660,1.4028&z=16&hl=fr&ie=UTF8&output=embed",
  mapsPlaceUrl:
    "https://www.google.com/maps/search/?api=1&query=244+Route+de+Seysses,+B%C3%A2t.1,+1er+%C3%A9tage,+31100+Toulouse&query_place_id=&center=43.5660%2C1.4028",
  mapsOsmEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=1.3928%2C43.5600%2C1.4128%2C43.5720&layer=mapnik&marker=43.5660%2C1.4028",
  images: {
    hero:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80",
    formation:
      "https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    vae: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    finance:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    blog: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
    contact:
      "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80",
    elearning:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    centre:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    toulouse:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    security:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
        alt: "Salle de cours équipée pour la formation DGESP",
        label: "Salles de cours",
      },
      {
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
        alt: "Espace de travail collaboratif au centre F2M",
        label: "Espace coworking",
      },
      {
        src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80",
        alt: "Accueil des stagiaires F2M Consulting Toulouse",
        label: "Accueil stagiaires",
      },
      {
        src: "https://images.unsplash.com/photo-1588196749592-7cec0da80027?auto=format&fit=crop&w=600&q=80",
        alt: "Salle de visioconférence pour classes virtuelles",
        label: "Visioconférence",
      },
    ],
    avatars: [
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        alt: "Portrait stagiaire DGESP",
      },
      {
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
        alt: "Portrait dirigeant sécurité privée",
      },
      {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
        alt: "Portrait repreneur entreprise SSP",
      },
    ],
    blogPosts: {
      cnaps:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      gardiennage:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
      cpf: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
      convention:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
    },
  },
  nav: [
    { label: "Accueil", href: "index.html", rootOnly: true },
    { label: "Notre Centre", href: "notre-centre/index.html" },
    { label: "Formation DGESP", href: "formation-dgesp/index.html", highlight: true },
    { label: "VAE", href: "vae-dgesp/index.html" },
    { label: "Financements", href: "financements/index.html" },
    { label: "Blog", href: "blog/index.html" },
    { label: "E-learning", href: "e-learning/index.html" },
    { label: "Contact", href: "contact/index.html" },
  ],
  legal: [
    { label: "Mentions légales", href: "mentions-legales.html" },
    { label: "Politique de confidentialité", href: "politique-confidentialite.html" },
    { label: "CGV", href: "cgv.html" },
  ],
  keywords:
    "formation sécurité privée toulouse, DGESP toulouse, centre formation CNAPS 31",
};
