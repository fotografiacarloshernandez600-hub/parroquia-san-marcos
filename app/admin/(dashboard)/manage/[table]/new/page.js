import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTabla } from '@/lib/tablesConfig';
import ManageForm from '@/app/components/ManageForm';

export async function generateMetadata({ params }) {
  const { table } = await params;
  const conf = getTabla(table);
  return { title: `Agregar - ${conf?.titulo || 'Sección'} | Panel admin` };
}

export default async function ManageNewPage({ params, searchParams }) {
  const { table } = await params;
  const sp = await searchParams;
  const conf = getTabla(table);
  if (!conf) notFound();

  return (
    <>
      <div className="admin-topbar">
        <h1>{conf.titulo} - Nuevo</h1>
        <Link href={`/admin/manage/${table}`} className="btn gris">← Volver al listado</Link>
      </div>
      <ManageForm table={table} conf={conf} registro={null} error={sp?.error} />
    </>
  );
}
