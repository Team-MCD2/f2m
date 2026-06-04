import Image from "next/image";
import { F2M_LOGO_PATH, F2M_SITE } from "@/lib/vitrine/site-config";

type BrandLogoProps = {
  className?: string;
  /** Hauteur affichée en px (largeur auto). */
  height?: number;
  priority?: boolean;
};

/** Logo image officiel F2M (signature script). */
export function BrandLogo({
  className = "",
  height = 44,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={F2M_LOGO_PATH}
      alt={`${F2M_SITE.name} — formation DGESP et sécurité privée à Toulouse`}
      width={280}
      height={80}
      className={["brand-logo-img", className].filter(Boolean).join(" ")}
      style={{ width: "auto", height }}
      priority={priority}
    />
  );
}
