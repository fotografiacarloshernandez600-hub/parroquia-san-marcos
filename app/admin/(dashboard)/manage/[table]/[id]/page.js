import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getTabla } from '@/lib/tablesConfig';
import ManageForm from '@/app/components/ManageForm';

export async function generateMetadata({ params }) {
  const { table } = await params;
  const conf = getTabla(table);
  return { title: `Editar - ${conf?.titulo || 'Sección'} | Panel admin` };
}

export default async function ManageEditPage({ params, searchParams }) {
  const { table, id } = await params;
  const sp = await searchParams;
  const conf = getTabla(table);
  if (!conf) notFound();

  const db = supabaseAdmin();
  const { data: registro } = await db.from(table).select('*').eq('id', id).single();
  if (!registro) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h1>{conf.titulo} - Editar</h1>
        <Link href={`/admin/manage/${table}`} className="btn gris">← Volver al listado</Link>
      </div>
      <ManageForm table={table} conf={conf} registro={registro} error={sp?.error} />
    </>
  );
}
