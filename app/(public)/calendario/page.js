import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';

export const metadata = { title: 'Calendario Litúrgico | Parroquia San Marcos Evangelista' };

export default async function CalendarioPage() {
  const db = supabaseAdmin();
  const { data: items } = await db.from('calendario_liturgico')
    .select('*')
    .order('orden', { ascending: true })
    .order('id', { ascending: false });

  const lista = items ?? [];

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion reveal">
          <span className="eyebrow">Año litúrgico</span>
          <h2>Calendario Litúrgico</h2>
          <p>Consulta el calendario litúrgico de nuestra parroquia con las celebraciones y tiempos del año.</p>
        </div>

        <div className="calendario-imagenes">
          {lista.map((it) => (
            <figure className="calendario-figura reveal" key={it.id}>
              {it.imagen && (
                <img src={publicUrl(it.imagen)} alt={it.titulo || 'Calendario litúrgico'} loading="lazy" />
              )}
              {it.titulo && <figcaption>{it.titulo}</figcaption>}
            </figure>
          ))}
          {lista.length === 0 && (
            <p className="text-center">Próximamente se publicará el calendario litúrgico.</p>
          )}
        </div>
      </div>
    </section>
  );
}
