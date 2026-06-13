import Link from 'next/link';

export default function Footer({ settings }) {
  return (
    <footer className="sitio-footer">
      <div className="container footer-grid">
        <div>
          <h4>Parroquia San Marcos Evangelista</h4>
          <p>&quot;Comprometernos decididamente con la nueva evangelización&quot; desde una comunidad parroquial samaritana</p>
        </div>
        <div>
          <h4>Contacto</h4>
          <p>📍 {settings.direccion}</p>
          <p>📞 {settings.telefono}</p>
          <p>✉️ {settings.email}</p>
        </div>
        <div>
          <h4>Síguenos</h4>
          <p><a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></p>
          <p><Link href="/contacto">Cómo llegar</Link></p>
        </div>
        <div>
          <h4>Enlaces</h4>
          <p><Link href="/sacramentos">Solicitar sacramentos</Link></p>
          <p><Link href="/calendario">Calendario litúrgico</Link></p>
          <p><Link href="/admin/login">Acceso administrador</Link></p>
        </div>
      </div>
      <div className="footer-bottom container">
        &copy; {new Date().getFullYear()} Parroquia San Marcos Evangelista - Paraíso, Tabasco. Todos los derechos reservados.
      </div>
    </footer>
  );
}
