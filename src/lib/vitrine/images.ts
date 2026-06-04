/** URLs d’images stables (Unsplash / Travel Assets) — pas de SVG placeholder en prod */

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const TOULOUSE_IMAGE =
  "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/266000/266374-Toulouse.jpg";

const UNSPLASH = (path: string, w = 800) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=${w}&q=80`;

export const VITRINE_IMAGES = {
  hero: U("photo-1524178232363-1fb2b075b655", 1920),
  toulouse: TOULOUSE_IMAGE,
  toulouseFallback: TOULOUSE_IMAGE,
  formation: UNSPLASH("photo-1563986768609-322da13575f3", 800),
  formationFallback: UNSPLASH("photo-1454165804603-c3d57bc86b40", 800),
  featured: {
    formation: UNSPLASH("photo-1563986768609-322da13575f3", 800),
    formationFallback: UNSPLASH("photo-1454165804603-c3d57bc86b40", 800),
    vae: U("photo-1552664730-d307ca884978", 800),
    vaeFallback: U("photo-1552664730-d307ca884978", 800),
    financements: U("photo-1554224155-6726b3ff858f", 800),
    financementsFallback: U("photo-1454165804603-c3d57bc86b40", 800),
    elearning: U("photo-1516321318423-f06f85e504b3", 800),
    elearningFallback:
      "https://www.dtp-ag.com/wp-content/uploads/visioconference-informatique-mobilier-salle-quel.jpeg",
    centre: U("photo-1497366216548-37526070297c", 800),
    centreFallback: TOULOUSE_IMAGE,
    contact: U("photo-1423666639041-f56000c27a9a", 800),
    contactFallback: U("photo-1423666639041-f56000c27a9a", 800),
  },
  vae: U("photo-1552664730-d307ca884978", 1200),
  finance: U("photo-1554224155-6726b3ff858f", 1200),
  blog: U("photo-1504711434969-e33886168f5c", 1600),
  contact: U("photo-1423666639041-f56000c27a9a", 1600),
  elearning: U("photo-1516321318423-f06f85e504b3", 1200),
  centre: U("photo-1497366216548-37526070297c", 1200),
  security: U("photo-1563986768609-322da13575f3", 800),
  financements: {
    cpf: U("photo-1554224155-6726b3ff858f", 600),
    cpfFallback: U("photo-1454165804603-c3d57bc86b40", 600),
    franceTravail: U("photo-1521791136064-7986c2920216", 600),
    franceTravailFallback: U("photo-1521791136064-7986c2920216", 600),
    opco: U("photo-1486406146926-c627a92ad1ab", 600),
    opcoFallback: U("photo-1486406146926-c627a92ad1ab", 600),
    entreprise: U("photo-1497366216548-37526070297c", 600),
    entrepriseFallback: U("photo-1497366216548-37526070297c", 600),
    personnel: U("photo-1507003211169-0a1dd7228f2d", 600),
    personnelFallback: U("photo-1507003211169-0a1dd7228f2d", 600),
  },
  elearningCards: {
    classes:
      "https://tse3.mm.bing.net/th/id/OIP.BA_iwS9sOBAR0xWBr6bPpAHaDt?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3",
    classesFallback:
      "https://tse3.mm.bing.net/th/id/OIP.BA_iwS9sOBAR0xWBr6bPpAHaDt?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3",
    guide:
      "https://tse1.mm.bing.net/th/id/OIP.Clp_cVcaUJj6zxx4k3PoYAHaDt?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3",
    guideFallback:
      "https://tse1.mm.bing.net/th/id/OIP.Clp_cVcaUJj6zxx4k3PoYAHaDt?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3",
    mobile: U("photo-1512941937669-90a1b58e7e9c", 600),
    mobileFallback: U("photo-1512941937669-90a1b58e7e9c", 600),
  },
  blogPosts: {
    cnaps: U("photo-1563986768609-322da13575f3", 600),
    gardiennage:
      "https://tse2.mm.bing.net/th/id/OIP.qifb1eBjOPv0Bl_mivOmVAHaE8?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3",
    gardiennageFallback:
      "https://tse2.mm.bing.net/th/id/OIP.qifb1eBjOPv0Bl_mivOmVAHaE8?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3",
    cpf:
      "https://tse2.mm.bing.net/th/id/OIP.UJmznf_NE21UuJzbP6JlAQHaGN?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3",
    cpfFallback:
      "https://tse2.mm.bing.net/th/id/OIP.UJmznf_NE21UuJzbP6JlAQHaGN?r=0&cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3",
    convention: U("photo-1450101499163-c8848c66ca85", 600),
  },
  gallery: {
    cours: U("photo-1524178232363-1fb2b075b655", 600),
    coworking: U("photo-1497366216548-37526070297c", 600),
    accueil: U("photo-1560472354-b33ff0c44a43", 600),
    visio:
      "https://www.dtp-ag.com/wp-content/uploads/visioconference-informatique-mobilier-salle-quel.jpeg",
  },
  avatars: [
    U("photo-1507003211169-0a1dd7228f2d", 150),
    U("photo-1472099645785-5658abf4ff4e", 150),
    U("photo-1438761681033-6461ffad8d80", 150),
  ],
} as const;
