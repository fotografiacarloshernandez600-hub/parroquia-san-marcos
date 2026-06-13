import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const metadata = { title: 'Solicitudes de sacramentos | Panel admin' };

const badgeClass = (estado) => {
  switch (estado) {
    case 'En revisión': return 'revision';
    case 'Aprobado': return 'aprobado';
    case 'Rechazado': return 'rechazado';
    default: return 'pendiente';
  }
};

export default async function SolicitudesPage({ searchParams }) {
  const sp = await searchParams;
  const db = supabaseAdmin();
  const { data: rows } = await db
    .from('solicitudes')
    .select('*, sacramentos(nombre)')
    .order('fecha_creacion', { ascending: false });

  return (
    <>
      <div className="admin-topbar"><h1>Solicitudes de Sacramentos</h1></div>
      {sp?.ok === '3' && <div className="alerta exito">Solicitud eliminada.</div>}

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr><th>Fecha</th><th>Sacramento</th><th>Solicitante</th><th>Para</th><th>Teléfono</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.fecha_creacion).toLocaleString('es-MX')}</td>
                <td>{row.sacramentos?.nombre || '—'}</td>
                <td>{row.nombre_solicitante}</td>
                <td>{row.nombre_persona || '—'}</td>
                <td>{row.telefono}</td>
                <td><span className={`badge ${badgeClass(row.estado)}`}>{row.estado}</span></td>
                <td><Link href={`/admin/solicitudes/${row.id}`} className="btn chico">Ver</Link></td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan={7}>No se han recibido solicitudes todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
