'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ITEMS_CONTENIDO = [
  { href: '/admin/manage/horarios_misa', label: 'Horarios de misa' },
  { href: '/admin/manage/horarios_oficina', label: 'Atención de oficina' },
  { href: '/admin/manage/sacramentos', label: 'Sacramentos / requisitos' },
  { href: '/admin/manage/grupos', label: 'Grupos y movimientos' },
  { href: '/admin/manage/clero', label: 'Sacerdotes' },
  { href: '/admin/manage/ermitas', label: 'Ermitas' },
  { href: '/admin/manage/eventos', label: 'Eventos / avisos' },
  { href: '/admin/manage/galeria', label: 'Galería de fotos' },
  { href: '/admin/manage/calendario_liturgico', label: 'Calendario litúrgico' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const activo = (href) => (pathname === href || pathname.startsWith(href + '/')) ? 'activo' : '';

  const cerrarSesion = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="admin-sidebar no-imprimir">
      <h2>⛪ Panel Admin</h2>
      <Link href="/admin" className={pathname === '/admin' ? 'activo' : ''}>Inicio</Link>

      <div className="grupo-titulo">Contenido del sitio</div>
      <Link href="/admin/ajustes" className={activo('/admin/ajustes')}>Datos generales / Sobre nosotros</Link>
      {ITEMS_CONTENIDO.map((item) => (
        <Link key={item.href} href={item.href} className={activo(item.href)}>{item.label}</Link>
      ))}

      <div className="grupo-titulo">Trámites</div>
      <Link href="/admin/solicitudes" className={activo('/admin/solicitudes')}>Solicitudes de sacramentos</Link>

      <div className="grupo-titulo">Cuenta</div>
      <Link href="/admin/password" className={activo('/admin/password')}>Cambiar contraseña</Link>
      <Link href="/" target="_blank">Ver sitio público ↗</Link>
      <button type="button" className="link-like" onClick={cerrarSesion}>Cerrar sesión</button>
    </aside>
  );
}
