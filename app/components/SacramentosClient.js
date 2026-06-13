'use client';

import { useState } from 'react';

export default function SacramentosClient({ sacramentos }) {
  const [abiertos, setAbiertos] = useState({});
  const [sacramentoId, setSacramentoId] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null); // { tipo: 'exito'|'error', mensaje }
  const [archivos, setArchivos] = useState([]);

  const toggle = (id) => setAbiertos((prev) => ({ ...prev, [id]: !prev[id] }));

  const solicitar = (id) => {
    setSacramentoId(String(id));
    const el = document.getElementById('solicitud');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/solicitudes', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResultado({ tipo: 'exito', mensaje: '¡Tu solicitud fue enviada correctamente! La oficina parroquial revisará tu información y se comunicará contigo pronto.' });
        form.reset();
        setSacramentoId('');
        setArchivos([]);
      } else {
        setResultado({ tipo: 'error', mensaje: data.error || 'Ocurrió un error al enviar tu solicitud. Intenta de nuevo.' });
      }
    } catch {
      setResultado({ tipo: 'error', mensaje: 'No se pudo conectar con el servidor. Intenta de nuevo.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <section className="contenido">
        <div className="container">
          <div className="titulo-seccion">
            <h2>Sacramentos y Requisitos</h2>
            <p>Da clic en cada sacramento para ver los documentos y requisitos necesarios. También puedes enviar tu solicitud en línea junto con tus comprobantes.</p>
          </div>

          {sacramentos.map((s) => (
            <div className={`acordeon-item ${abiertos[s.id] ? 'abierto' : ''}`} key={s.id}>
              <button type="button" className="acordeon-header" onClick={() => toggle(s.id)}>
                <span>{s.nombre}</span>
                <span>＋</span>
              </button>
              <div className="acordeon-body">
                <p>{s.descripcion}</p>
                <h4>Documentos y requisitos:</h4>
                <ul>
                  {(s.requisitos ?? '').split('\n').map((r, i) => r.trim() && <li key={i}>{r.trim()}</li>)}
                </ul>
                <p><button type="button" className="boton chico" onClick={() => solicitar(s.id)}>Solicitar este sacramento en línea →</button></p>
              </div>
            </div>
          ))}
          {sacramentos.length === 0 && <p>Próximamente se publicará información sobre los sacramentos.</p>}
        </div>
      </section>

      <section className="contenido alt" id="solicitud">
        <div className="container">
          <div className="titulo-seccion">
            <h2>Solicitud en línea</h2>
            <p>Llena este formulario para iniciar tu trámite. Sube fotos o PDF de tus comprobantes (acta de nacimiento, constancias de pláticas, identificaciones, etc.). La oficina parroquial revisará tu solicitud y se pondrá en contacto contigo para confirmar fecha y horario.</p>
          </div>

          {resultado && (
            <div className={`alerta ${resultado.tipo}`} style={{ maxWidth: 650, margin: '0 auto 16px' }}>
              {resultado.mensaje}
            </div>
          )}

          <form className="form-publico" onSubmit={handleSubmit}>
            <div className="form-grupo">
              <label htmlFor="sel_sacramento">Sacramento que solicitas *</label>
              <select name="sacramento_id" id="sel_sacramento" required value={sacramentoId} onChange={(e) => setSacramentoId(e.target.value)}>
                <option value="">-- Selecciona --</option>
                {sacramentos.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>

            <div className="form-grupo">
              <label htmlFor="nombre_solicitante">Tu nombre completo *</label>
              <input type="text" name="nombre_solicitante" id="nombre_solicitante" required />
            </div>

            <div className="form-grupo">
              <label htmlFor="nombre_persona">Nombre de la persona que recibirá el sacramento</label>
              <input type="text" name="nombre_persona" id="nombre_persona" placeholder="(si es diferente a ti)" />
            </div>

            <div className="form-grupo">
              <label htmlFor="telefono">Teléfono de contacto *</label>
              <input type="tel" name="telefono" id="telefono" required />
            </div>

            <div className="form-grupo">
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" name="email" id="email" />
            </div>

            <div className="form-grupo">
              <label htmlFor="mensaje">Mensaje o información adicional</label>
              <textarea name="mensaje" id="mensaje" rows={4} placeholder="Ej. fecha tentativa, dudas, etc."></textarea>
            </div>

            <div className="form-grupo">
              <label htmlFor="comprobantes">Sube tus comprobantes (puedes seleccionar varios archivos)</label>
              <input
                type="file" name="comprobantes" id="comprobantes" multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={(e) => setArchivos(Array.from(e.target.files ?? []).map((f) => f.name))}
              />
              <small>Formatos permitidos: JPG, PNG, WEBP, PDF. Máximo 5 MB por archivo.</small>
              {archivos.length > 0 && (
                <div style={{ marginTop: 6, fontSize: '0.9rem', color: '#555' }}>
                  Archivos seleccionados: {archivos.join(', ')}
                </div>
              )}
            </div>

            <button type="submit" className="boton" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
