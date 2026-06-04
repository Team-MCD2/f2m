import Link from "next/link";
import { F2M_SITE } from "@/lib/vitrine/site-config";

export function HomeTopBar() {
  return (
    <div
      className="vitrine-top-bar vitrine-top-bar--compact"
      role="region"
      aria-label="Coordonnées F2M Consulting"
    >
      <div className="container vitrine-top-bar-inner">
        <Link href="/notre-centre" className="vitrine-top-bar-item">
          <span aria-hidden="true">📍</span>
          Toulouse · {F2M_SITE.address.city}
        </Link>
        <a href={`tel:${F2M_SITE.phoneTel}`} className="vitrine-top-bar-item">
          <span aria-hidden="true">📞</span>
          {F2M_SITE.phone}
        </a>
        <Link href="/contact" className="vitrine-top-bar-item">
          <span aria-hidden="true">✉️</span>
          {F2M_SITE.email}
        </Link>
      </div>
    </div>
  );
}
