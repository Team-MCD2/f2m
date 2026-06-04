/** URLs d’images stables (Unsplash / Travel Assets) — pas de SVG placeholder en prod */

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const TOULOUSE_IMAGE =
  "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/266000/266374-Toulouse.jpg";

export const VITRINE_IMAGES = {
  hero: U("photo-1524178232363-1fb2b075b655", 1920),
  toulouse: TOULOUSE_IMAGE,
  toulouseFallback: TOULOUSE_IMAGE,
  formation: U("photo-1454165804603-c3d57bc86b40", 1200),
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
    classes: U("photo-1588196749592-7cec0da80027", 600),
    classesFallback: U("photo-1588196749592-7cec0da80027", 600),
    guide: U("photo-1454165804603-c3d57bc86b40", 600),
    guideFallback: U("photo-1454165804603-c3d57bc86b40", 600),
    mobile: U("photo-1512941937669-90a1b58e7e9c", 600),
    mobileFallback: U("photo-1512941937669-90a1b58e7e9c", 600),
  },
  blogPosts: {
    cnaps: U("photo-1563986768609-322da13575f3", 600),
    gardiennage: U("photo-1563986768609-322da13575f3", 600),
    gardiennageFallback: U("photo-1563986768609-322da13575f3", 600),
    cpf: U("photo-1554224155-6726b3ff858f", 600),
    cpfFallback: U("photo-1454165804603-c3d57bc86b40", 600),
    convention: U("photo-1450101499163-c8848c66ca85", 600),
  },
  gallery: {
    cours: U("photo-1524178232363-1fb2b075b655", 600),
    coworking: U("photo-1497366216548-37526070297c", 600),
    accueil: U("photo-1560472354-b33ff0c44a43", 600),
    visio: U("photo-1588196749592-7cec0da80027", 600),
  },
  avatars: [
    U("photo-1507003211169-0a1dd7228f2d", 150),
    U("photo-1472099645785-5658abf4ff4e", 150),
    U("photo-1438761681033-6461ffad8d80", 150),
  ],
} as const;
