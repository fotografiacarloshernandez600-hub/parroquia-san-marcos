'use client';

import dynamic from 'next/dynamic';

const MapaErmitas = dynamic(() => import('./MapaErmitas'), {
  ssr: false,
  loading: () => <div className="mapa-leaflet" style={{ display: 'grid', placeItems: 'center', color: '#6b736f' }}>Cargando mapa…</div>,
});

export default function MapaErmitasWrapper({ ermitas }) {
  return <MapaErmitas ermitas={ermitas} />;
}
