import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';
import { updateSolicitudAction, deleteSolicitudAction } from '@/lib/actions/solicitudes';
import ConfirmSubmitButton from '@/app/components/ConfirmSubmitButton';

export const metadata = { title: 'Solicitud | Panel admin' };

const badgeClass = (estado) => {
  switch (estado) {
    case 'En revisión': return 'revision';
    case 'Aprobado': return 'aprobado';
    case 'Rechazado': return 'rechazado';
    default: return 'pendiente';
  }
};

export default async function SolicitudDetallePage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const db = supabaseAdmin();

  const { data: sol } = await db.from('solicitudes').select('*, sacramentos(nombre)').eq('id', id).single();
  if (!sol) notFound();

  const { data: archivos } = await db.from('solicitud_archivos').select('*').eq('solicitud_id', id);

  return (
    <>
      <Link href="/admin/solicitudes" className="btn gris">← Volver al listado</Link>

      {sp?.ok === '1' && <div className="alerta exito" style={{ marginTop: 16 }}>Solicitud actualizada.</div>}

      <div className="card" style={{ marginTop: 16 }}>
        <h2>{sol.sacramentos?.nombre || 'Sacramento'}</h2>
        <p><strong>Solicitado por:</strong> {sol.nombre_solicitante}</p>
        {sol.nombre_persona && <p><strong>Recibirá el sacramento:</strong> {sol.nombre_persona}</p>}
        <p><strong>Teléfono:</strong> {sol.telefono} &nbsp; <strong>Correo:</strong> {sol.email || '—'}</p>
        <p><strong>Fecha de solicitud:</strong> {new Date(sol.fecha_creacion).toLocaleString('es-MX')}</p>
        <p><strong>Mensaje:</strong><br />{sol.mensaje}</p>
        <p><strong>Estado actual:</strong> <span className={`badge ${badgeClass(sol.estado)}`}>{sol.estado}</span></p>
      </div>

      <div className="card">
        <h3>Comprobantes adjuntos</h3>
        {(!archivos || archivos.length === 0) ? (
          <p>No se adjuntaron archivos.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {archivos.map((a) => {
              const ext = (a.ruta_archivo.split('.').pop() || '').toLowerCase();
              const url = publicUrl(a.ruta_archivo);
              return (
                <div style={{ textAlign: 'center' }} key={a.id}>
                  {ext === 'pdf' ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn chico">📄 Ver PDF<br />{a.nombre_original}</a>
                  ) : (
                    <>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 8 }} alt="" />
                      </a>
                      <br /><small>{a.nombre_original}</small>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Actualizar solicitud</h3>
        <form action={updateSolicitudAction.bind(null, sol.id)}>
          <div className="form-grupo">
            <label>Estado</label>
            <select name="estado" defaultValue={sol.estado}>
              {['Pendiente', 'En revisión', 'Aprobado', 'Rechazado'].map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          <div className="form-grupo">
            <label>Notas internas (visibles solo para el equipo parroquial)</label>
            <textarea name="notas_admin" rows={4} defaultValue={sol.notas_admin || ''} />
          </div>
          <button type="submit" className="btn">Guardar cambios</button>{' '}
          <Link href={`/admin/boleta/${sol.id}`} target="_blank" className="btn naranja">🖨️ Imprimir boleta</Link>
        </form>
        <form action={deleteSolicitudAction.bind(null, sol.id)} style={{ marginTop: 10 }}>
          <ConfirmSubmitButton className="btn rojo" mensaje="¿Eliminar esta solicitud y sus archivos?">Eliminar solicitud</ConfirmSubmitButton>
        </form>
      </div>
    </>
  );
}
