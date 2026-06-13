'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function MapaContacto({ lat, lng }) {
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
        if (cont._leaflet_id) { cont._leaflet_id = null; }

        const map = L.map(cont).setView([lat, lng], 16);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        L.marker([lat, lng]).addTo(map)
          .bindPopup('Parroquia San Marcos Evangelista')
          .openPopup();

        setTimeout(() => { if (mapRef.current) mapRef.current.invalidateSize(); }, 200);
      } catch (e) {
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
  }, [lat, lng]);

  return <div ref={containerRef} className="mapa-leaflet-contacto" />;
}
