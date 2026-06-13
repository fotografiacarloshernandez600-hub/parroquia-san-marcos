'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/horarios', label: 'Horarios' },
  { href: '/nosotros', label: 'La Parroquia' },
  { href: '/sacramentos', label: 'Sacramentos' },
  { href: '/grupos', label: 'Grupos' },
  { href: '/ermitas', label: 'Ermitas' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/galeria', label: 'Galería' },
  { href: '/calendario', label: 'Calendario' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sitio-header">
      <div className="header-inner container">
        <div className="logo-area">
          {/* Si subes /public/logo.png se mostrará automáticamente */}
          <img
            src="/logo.png"
            alt="Logo de la parroquia"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="nombre">
            <h1>Parroquia San Marcos Evangelista</h1>
            <small>Paraíso, Tabasco</small>
          </div>
        </div>
        <button className="menu-toggle" onClick={() => setAbierto(!abierto)}>☰ Menú</button>
        <nav className={`menu ${abierto ? 'abierto' : ''}`}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'activo' : ''}
              onClick={() => setAbierto(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
