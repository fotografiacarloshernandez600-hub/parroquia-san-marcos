import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSettings } from '@/lib/settings';
import { getVaticanNews } from '@/lib/vaticanNews';
import { truncar } from '@/lib/format';

export const metadata = { title: 'Inicio | Parroquia San Marcos Evangelista' };

export default async function InicioPage() {
  const db = supabaseAdmin();
  const settings = await getSettings();

  const { data: misas } = await db.from('horarios_misa').select('*').order('orden', { ascending: true });
  const { data: eventos } = await db.from('eventos').select('*').order('fecha', { ascending: true, nullsFirst: false }).limit(3);
  const noticias = await getVaticanNews(3);

  return (
    <>
      <div className="hero">
        <div className="container">
          <h1>Bienvenidos a la Parroquia San Marcos Evangelista</h1>
          <p>&quot;Comprometernos decididamente con la nueva evangelización&quot; desde una comunidad parroquial samaritana</p>
          <p className="mt-2">
            <Link href="/horarios" className="boton">Ver horarios de misa</Link>{' '}
            <Link href="/sacramentos" className="boton secundario">Solicitar sacramentos</Link>
          </p>
        </div>
      </div>

      <section className="contenido">
        <div className="container">
          <div className="titulo-seccion">
            <h2>Próximas misas</h2>
            <p>Consulta los horarios regulares de celebraciones en nuestro templo.</p>
          </div>
          <table className="horarios">
            <thead><tr><th>Día</th><th>Hora</th><th>Celebración</th><th>Lugar</th></tr></thead>
            <tbody>
              {(misas ?? []).map((m) => (
                <tr key={m.id}>
                  <td>{m.dia}</td>
                  <td>{m.hora}</td>
                  <td>{m.tipo}</td>
                  <td>{m.lugar}</td>
                </tr>
              ))}
              {(!misas || misas.length === 0) && (
                <tr><td colSpan={4}>Próximamente se publicarán los horarios.</td></tr>
              )}
            </tbody>
          </table>
          <p className="text-center mt-2"><Link href="/horarios" className="boton chico">Ver todos los horarios y atención de oficina →</Link></p>
        </div>
      </section>

      <section className="contenido alt">
        <div className="container">
          <div className="titulo-seccion">
            <h2>Próximos eventos</h2>
            <p>Avisos parroquiales, fiestas patronales y celebraciones especiales.</p>
          </div>
          <div className="grid-cards">
            {(eventos ?? []).map((ev) => (
              <div className="card-item" key={ev.id}>
                {ev.imagen && <img src={ev.imagen} alt={ev.titulo} />}
                <div className="card-body">
                  <h3>{ev.titulo}</h3>
                  {ev.fecha && <div className="meta">📅 {ev.fecha}{ev.hora ? ' - ' + ev.hora : ''}</div>}
                  <p>{truncar(ev.descripcion ?? '', 160)}</p>
                </div>
              </div>
            ))}
            {(!eventos || eventos.length === 0) && <p>Pronto publicaremos los próximos eventos parroquiales.</p>}
          </div>
          <p className="text-center mt-2"><Link href="/eventos" className="boton chico">Ver todos los eventos →</Link></p>
        </div>
      </section>

      <section className="contenido">
        <div className="container">
          <div className="titulo-seccion">
            <h2>Noticias del Vaticano</h2>
            <p>Últimas publicaciones de Vatican News.</p>
          </div>
          {noticias.map((n, i) => (
            <div className="noticia-item" key={i}>
              <h3><a href={n.link} target="_blank" rel="noopener noreferrer">{n.titulo}</a></h3>
              <div className="fecha">{n.fecha}</div>
              <p>{n.resumen}…</p>
            </div>
          ))}
          {noticias.length === 0 && (
            <p className="text-center">No se pudieron cargar las noticias en este momento. <a href="https://www.vaticannews.va/es.html" target="_blank" rel="noopener noreferrer">Visitar Vatican News</a></p>
          )}
          <p className="text-center mt-2"><Link href="/noticias" className="boton chico">Ver más noticias →</Link></p>
        </div>
      </section>

      <section className="contenido alt">
        <div className="container">
          <div className="titulo-seccion">
            <h2>¿Cómo llegar?</h2>
          </div>
          <p className="text-center">
            📍 {settings.direccion}<br />
            📞 {settings.telefono} &nbsp; ✉️ {settings.email}
          </p>
          <p className="text-center"><Link href="/contacto" className="boton chico">Ver mapa y contacto →</Link></p>
        </div>
      </section>
    </>
  );
}
