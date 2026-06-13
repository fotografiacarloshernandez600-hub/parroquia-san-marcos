import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAdminSession } from '@/lib/auth';

export const metadata = { title: 'Inicio | Panel admin' };

export default async function AdminHomePage() {
  const session = await getAdminSession();
  const db = supabaseAdmin();

  const count = async (table, filtros) => {
    let q = db.from(table).select('*', { count: 'exact', head: true });
    if (filtros) q = filtros(q);
    const { count: c } = await q;
    return c ?? 0;
  };

  const [pendientes, totalSolicitudes, totalEventos, totalFotos, totalErmitas, totalGrupos] = await Promise.all([
    count('solicitudes', (q) => q.eq('estado', 'Pendiente')),
    count('solicitudes'),
    count('eventos'),
    count('galeria'),
    count('ermitas'),
    count('grupos'),
  ]);

  return (
    <>
      <div className="admin-topbar">
        <h1>Hola, {session?.nombre || 'Administrador'} 👋</h1>
      </div>

      <div className="card">
        <p>Desde aquí puedes administrar todo el contenido del sitio web de la Parroquia San Marcos Evangelista: horarios, información general, sacramentos, grupos, ermitas, eventos, galería, calendario litúrgico y las solicitudes en línea que envíen los feligreses.</p>
      </div>

      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--a-secundario)' }}>{pendientes}</h2>
          <small>Solicitudes pendientes</small>
          <div><Link href="/admin/solicitudes" className="btn chico naranja" style={{ marginTop: 6 }}>Ver solicitudes</Link></div>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{totalSolicitudes}</h2>
          <small>Solicitudes totales</small>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{totalEventos}</h2>
          <small>Eventos publicados</small>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{totalFotos}</h2>
          <small>Fotos en galería</small>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{totalErmitas}</h2>
          <small>Ermitas registradas</small>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{totalGrupos}</h2>
          <small>Grupos parroquiales</small>
        </div>
      </div>

      <div className="card">
        <h2>Accesos rápidos</h2>
        <p>
          <Link href="/admin/ajustes" className="btn">Editar datos generales</Link>{' '}
          <Link href="/admin/manage/horarios_misa" className="btn naranja">Horarios de misa</Link>{' '}
          <Link href="/admin/manage/eventos" className="btn naranja">Agregar evento</Link>{' '}
          <Link href="/admin/manage/galeria" className="btn naranja">Subir fotos</Link>{' '}
          <Link href="/admin/manage/ermitas" className="btn naranja">Agregar ermita</Link>{' '}
          <Link href="/admin/solicitudes" className="btn">Revisar solicitudes</Link>
        </p>
      </div>
    </>
  );
}
