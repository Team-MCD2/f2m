import { Section } from "@/components/vitrine/section";
import { VitrineImage } from "@/components/vitrine/vitrine-image";
import { VitrineImageZoom } from "@/components/vitrine/vitrine-image-zoom";
import { VITRINE_IMAGES } from "@/lib/vitrine/images";

const GALLERY = [
  {
    src: VITRINE_IMAGES.gallery.cours,
    alt: "Salle de cours équipée pour la formation DGESP",
    label: "Salles de cours",
  },
  {
    src: VITRINE_IMAGES.gallery.coworking,
    alt: "Espace de travail collaboratif au centre F2M",
    label: "Espace coworking",
  },
  {
    src: VITRINE_IMAGES.gallery.accueil,
    alt: "Accueil des stagiaires F2M Consulting Toulouse",
    label: "Accueil stagiaires",
  },
  {
    src: VITRINE_IMAGES.gallery.visio,
    alt: "Salle de visioconférence pour classes virtuelles",
    label: "Visioconférence",
  },
] as const;

export function HomeGallery() {
  return (
    <Section
      id="centre-images"
      variant="navy"
      title="Le centre en images"
      subtitle="Un environnement pensé pour la formation des professionnels de la sécurité privée."
    >
      <div className="gallery-grid home-gallery-grid">
        {GALLERY.map((item) => (
          <figure key={item.label} className="gallery-item">
            <VitrineImageZoom className="gallery-item-zoom">
              <VitrineImage
                src={item.src}
                alt={item.alt}
                width={600}
                height={450}
                className="gallery-photo"
              />
            </VitrineImageZoom>
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
