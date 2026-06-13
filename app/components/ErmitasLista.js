'use client';

import { useState, useMemo } from 'react';

export default function ErmitasLista({ ermitas }) {
  const [busqueda, setBusqueda] = useState('');

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return ermitas;
    return ermitas.filter((e) => {
      const texto = `${e.nombre ?? ''} ${e.ubicacion_texto ?? ''}`.toLowerCase();
      return texto.includes(q);
    });
  }, [busqueda, ermitas]);

  return (
    <>
      <div className="buscador-wrap reveal">
        <span className="buscador-icono" aria-hidden="true">🔍</span>
        <input
          type="search"
          className="buscador-input"
          placeholder="Buscar ermita por nombre o comunidad…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar ermita"
        />
        {busqueda && (
          <button className="buscador-limpiar" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda">
            ✕
          </button>
        )}
      </div>

      {busqueda && (
        <p className="buscador-resultado">
          {filtradas.length === 0
            ? 'No se encontraron ermitas con ese nombre.'
            : `${filtradas.length} ${filtradas.length === 1 ? 'ermita encontrada' : 'ermitas encontradas'}.`}
        </p>
      )}

      <div className="grid-cards mt-2">
        {filtradas.map((erm) => (
          <div className="card-item reveal" key={erm.id}>
            {erm.imagenUrl && <img src={erm.imagenUrl} alt={erm.nombre} />}
            <div className="card-body">
              <h3>{erm.nombre}</h3>
              {erm.ubicacion_texto && <div className="meta">📍 {erm.ubicacion_texto}</div>}
              <p style={{ whiteSpace: 'pre-line' }}>{erm.descripcion}</p>
            </div>
          </div>
        ))}
        {ermitas.length === 0 && <p>Próximamente se publicará la lista de ermitas.</p>}
      </div>
    </>
  );
}
