import { getVaticanNews } from '@/lib/vaticanNews';

export const metadata = { title: 'Noticias del Vaticano | Parroquia San Marcos Evangelista' };

export default async function NoticiasPage() {
  const noticias = await getVaticanNews(12);

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion">
          <h2>Noticias del Vaticano</h2>
          <p>Contenido proporcionado por <a href="https://www.vaticannews.va/es.html" target="_blank" rel="noopener noreferrer">Vatican News</a>. Da clic en cada título para leer la noticia completa en su sitio oficial.</p>
        </div>

        {noticias.map((n, i) => (
          <div className="noticia-item" key={i}>
            <h3><a href={n.link} target="_blank" rel="noopener noreferrer">{n.titulo}</a></h3>
            <div className="fecha">{n.fecha}</div>
            <p>{n.resumen}…</p>
          </div>
        ))}
        {noticias.length === 0 && (
          <p className="text-center">No se pudieron cargar las noticias en este momento. Visita <a href="https://www.vaticannews.va/es.html" target="_blank" rel="noopener noreferrer">Vatican News</a> directamente.</p>
        )}
      </div>
    </section>
  );
}
