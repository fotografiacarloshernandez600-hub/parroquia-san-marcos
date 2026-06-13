'use client';

import { useState } from 'react';

export default function SacramentosClient({ sacramentos }) {
  const [abiertos, setAbiertos] = useState({});
  const toggle = (id) => setAbiertos((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion reveal">
          <span className="eyebrow">Vida sacramental</span>
          <h2>Sacramentos y Requisitos</h2>
          <p>Da clic en cada sacramento para ver los documentos y requisitos que se solicitan. Para iniciar tu trámite, acércate a la oficina parroquial en su horario de atención.</p>
        </div>

        <div className="sacramentos-lista">
          {sacramentos.map((s, i) => (
            <div className={`acordeon-item reveal ${abiertos[s.id] ? 'abierto' : ''}`} key={s.id}>
              <button type="button" className="acordeon-header" onClick={() => toggle(s.id)}>
                <span className="sacramento-titulo">
                  <span className="sacramento-num">{String(i + 1).padStart(2, '0')}</span>
                  {s.nombre}
                </span>
                <span className="acordeon-mas">＋</span>
              </button>
              <div className="acordeon-body">
                {s.descripcion && <p className="sacramento-desc">{s.descripcion}</p>}
                <h4>Documentos y requisitos</h4>
                <ul className="requisitos-lista">
                  {(s.requisitos ?? '').split('\n').map((r, idx) => r.trim() && <li key={idx}>{r.trim()}</li>)}
                </ul>
              </div>
            </div>
          ))}
          {sacramentos.length === 0 && <p>Próximamente se publicará información sobre los sacramentos.</p>}
        </div>

        <div className="aviso-tramite reveal">
          <div className="aviso-icono">ℹ️</div>
          <div>
            <strong>¿Listo para iniciar tu trámite?</strong>
            <p>Reúne los documentos del sacramento que necesitas y acude a la oficina parroquial. Consulta los <a href="/horarios">horarios de atención</a> o escríbenos desde la sección de <a href="/contacto">contacto</a>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
