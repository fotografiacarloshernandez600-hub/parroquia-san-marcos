'use client';

import dynamic from 'next/dynamic';

const MapaContacto = dynamic(() => import('./MapaContacto'), {
  ssr: false,
  loading: () => <div className="mapa-leaflet-contacto" style={{ display: 'grid', placeItems: 'center', color: '#6b736f' }}>Cargando mapa…</div>,
});

export default function MapaContactoWrapper({ lat, lng }) {
  return <MapaContacto lat={lat} lng={lng} />;
}
