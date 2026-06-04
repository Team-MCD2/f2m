"use client";

import { useState } from "react";
import { F2M_SITE } from "@/lib/vitrine/site-config";

export function MapEmbed() {
  const [useOsm, setUseOsm] = useState(false);

  return (
    <div className="map-block">
      {!useOsm ? (
        <iframe
          className="map-embed"
          title="Carte Google Maps — F2M Consulting Toulouse"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          src={F2M_SITE.mapsEmbed}
        />
      ) : (
        <iframe
          className="map-embed"
          title="Carte OpenStreetMap — F2M Consulting Toulouse"
          loading="lazy"
          src={F2M_SITE.mapsOsmEmbed}
        />
      )}
      <div className="map-actions">
        <a href={F2M_SITE.mapsPlaceUrl} target="_blank" rel="noopener noreferrer">
          Ouvrir dans Google Maps
        </a>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          aria-pressed={useOsm}
          onClick={() => setUseOsm((v) => !v)}
        >
          {useOsm ? "Afficher Google Maps" : "Afficher OpenStreetMap (alternative)"}
        </button>
      </div>
    </div>
  );
}
