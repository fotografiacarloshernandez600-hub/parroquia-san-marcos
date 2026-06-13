'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <section className="contenido">
      <div className="container" style={{ maxWidth: 640, textAlign: 'center' }}>
        <span className="eyebrow">Algo no cargó bien</span>
        <h2>Ocurrió un problema al mostrar esta sección</h2>
        <p style={{ color: 'var(--gris)', marginBottom: 28 }}>
          Puedes intentar de nuevo o volver al inicio. Si el problema continúa, recarga la página.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="boton" onClick={() => reset()}>Intentar de nuevo</button>
          <Link href="/" className="boton ghost">Volver al inicio</Link>
        </div>
        {error?.message && (
          <p style={{ marginTop: 24, fontSize: '0.8rem', color: '#b5432a', wordBreak: 'break-word' }}>
            Detalle técnico: {error.message}
          </p>
        )}
      </div>
    </section>
  );
}
