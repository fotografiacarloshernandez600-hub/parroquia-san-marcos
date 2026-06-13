'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const CENTRO_PARAISO = [18.39611, -93.21278];

export default function MapaErmitas({ ermitas }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let destruido = false;
    const cont = containerRef.current;

    (async () => {
      try {
        const L = (await import('leaflet')).default;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (destruido || !cont) return;
        if (mapRef.current) return;
        // Si el contenedor quedó marcado por un montaje anterior, límpialo
        if (cont._leaflet_id) { cont._leaflet_id = null; }

        const conCoordenadas = (ermitas ?? []).filter((e) => e.lat && e.lng);
        const centro = conCoordenadas.length ? [conCoordenadas[0].lat, conCoordenadas[0].lng] : CENTRO_PARAISO;

        const map = L.map(cont).setView(centro, conCoordenadas.length > 1 ? 11 : 13);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const marcadores = [];
        conCoordenadas.forEach((e) => {
          const marker = L.marker([e.lat, e.lng]).addTo(map);
          const partes = [`<strong>${e.nombre}</strong>`];
          if (e.ubicacion_texto) partes.push(e.ubicacion_texto);
          if (e.descripcion) partes.push(String(e.descripcion).slice(0, 150));
          marker.bindPopup(partes.join('<br>'));
          marcadores.push(marker);
        });

        if (marcadores.length > 1) {
          const grupo = L.featureGroup(marcadores);
          map.fitBounds(grupo.getBounds().pad(0.2));
        }

        setTimeout(() => { if (mapRef.current) mapRef.current.invalidateSize(); }, 200);
      } catch (e) {
        // Si Leaflet falla, no rompemos la página: el mapa simplemente no se muestra.
        console.error('No se pudo cargar el mapa:', e);
      }
    })();

    return () => {
      destruido = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (cont) { cont._leaflet_id = null; }
    };
  }, [ermitas]);

  return <div ref={containerRef} className="mapa-leaflet" />;
}
