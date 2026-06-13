'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const CENTRO_PARAISO = [18.39611, -93.21278];

export default function MapaErmitas({ ermitas }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let map;
    let destruido = false;

    (async () => {
      const L = (await import('leaflet')).default;

      // Arreglar rutas de los iconos por defecto de Leaflet con bundlers modernos
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (destruido || !containerRef.current) return;

      const conCoordenadas = (ermitas ?? []).filter((e) => e.lat && e.lng);
      const centro = conCoordenadas.length ? [conCoordenadas[0].lat, conCoordenadas[0].lng] : CENTRO_PARAISO;

      map = L.map(containerRef.current).setView(centro, conCoordenadas.length > 1 ? 11 : 13);
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
    })();

    return () => {
      destruido = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [ermitas]);

  return <div ref={containerRef} className="mapa-leaflet" />;
}
