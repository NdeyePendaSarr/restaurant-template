"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";

/**
 * Carte Leaflet (OpenStreetMap, sans clé API) avec marqueur doré pulsé —
 * reprise fidèle du template. Leaflet est importé dynamiquement côté client
 * (il touche `window`), et son CSS est chargé une seule fois.
 */
export function RestaurantMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;

    (async () => {
      const L = (await import("leaflet")).default;

      // CSS Leaflet chargé dynamiquement (une seule fois).
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!ref.current || ref.current.dataset.init) return;
      ref.current.dataset.init = "1";

      map = L.map(ref.current, { scrollWheelZoom: false }).setView(
        [site.lat, site.lng],
        16
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.divIcon({
        className: "resto-marker",
        html: '<span class="resto-marker-dot"></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([site.lat, site.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${site.nom}</strong><br>${site.adresseDetail}`)
        .openPopup();

      map.on("click", () => map?.scrollWheelZoom.enable());
      map.on("mouseout", () => map?.scrollWheelZoom.disable());
    })();

    return () => {
      map?.remove();
      if (ref.current) delete ref.current.dataset.init;
    };
  }, []);

  return <div id="map" ref={ref} role="img" aria-label={`Plan d'accès de ${site.nom}`} />;
}
