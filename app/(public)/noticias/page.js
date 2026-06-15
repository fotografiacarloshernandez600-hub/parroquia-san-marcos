import { getVaticanNews } from '@/lib/vaticanNews';
import { getSettings } from '@/lib/settings';
import TransmisionesVivo from '@/app/components/TransmisionesVivo';

export const metadata = { title: 'Noticias y transmisiones | Parroquia San Marcos Evangelista' };

export default async function NoticiasPage() {
  const noticias = await getVaticanNews(12);
  const settings = await getSettings();

  return (
    <>
      <section className="contenido">
        <div className="container">
          <TransmisionesVivo
            facebookUrl={settings.vivo_facebook_url}
            papaUrl={settings.vivo_papa_url}
            mexicoUrl={settings.vivo_mexico_url}
          />
        </div>
      </section>

      <section className="contenido alt">
        <div className="container">
          <div className="titulo-seccion reveal">
            <span className="eyebrow">Iglesia universal</span>
            <h2>Noticias del Vaticano</h2>
            <p>Contenido proporcionado por <a href="https://www.vaticannews.va/es.html" target="_blank" rel="noopener noreferrer">Vatican News</a>. Da clic en cada título para leer la noticia completa en su sitio oficial.</p>
          </div>

          {noticias.map((n, i) => (
            <div className="noticia-item reveal" key={i}>
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
    </>
  );
}
