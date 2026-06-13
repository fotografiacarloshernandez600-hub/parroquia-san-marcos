import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';
import { getTabla } from '@/lib/tablesConfig';
import { deleteRecordAction } from '@/lib/actions/manage';
import ConfirmSubmitButton from '@/app/components/ConfirmSubmitButton';

export async function generateMetadata({ params }) {
  const { table } = await params;
  const conf = getTabla(table);
  return { title: `${conf?.titulo || 'Sección'} | Panel admin` };
}

export default async function ManageListPage({ params, searchParams }) {
  const { table } = await params;
  const sp = await searchParams;
  const conf = getTabla(table);
  if (!conf) notFound();

  const db = supabaseAdmin();
  const { data: rows } = await db.from(table).select('*')
    .order(conf.ordenCampo, { ascending: true })
    .order('id', { ascending: true });

  return (
    <>
      <div className="admin-topbar">
        <h1>{conf.titulo}</h1>
        <Link href={`/admin/manage/${table}/new`} className="btn naranja">+ Agregar nuevo</Link>
      </div>

      {sp?.ok === '1' && <div className="alerta exito">Registro guardado correctamente.</div>}
      {sp?.ok === '2' && <div className="alerta exito">Registro eliminado.</div>}

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              {conf.columnasLista.map((col) => (
                <th key={col}>{conf.campos[col]?.label || col}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row) => (
              <tr key={row.id}>
                {conf.columnasLista.map((col) => {
                  const def = conf.campos[col];
                  if (def?.tipo === 'image') {
                    return <td key={col}>{row[col] ? <img src={publicUrl(row[col])} className="img-mini" alt="" /> : '—'}</td>;
                  }
                  if (col === 'descripcion' || col === 'requisitos') {
                    const txt = row[col] || '';
                    return <td key={col}>{txt.length > 80 ? txt.slice(0, 80) + '…' : txt}</td>;
                  }
                  return <td key={col}>{row[col] ?? ''}</td>;
                })}
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/manage/${table}/${row.id}`} className="btn chico">Editar</Link>{' '}
                  <form action={deleteRecordAction.bind(null, table, row.id)} style={{ display: 'inline' }}>
                    <ConfirmSubmitButton className="btn chico rojo" mensaje="¿Eliminar este registro? Esta acción no se puede deshacer.">
                      Eliminar
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr><td colSpan={conf.columnasLista.length + 1}>No hay registros todavía. Da clic en &quot;Agregar nuevo&quot; para crear el primero.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
