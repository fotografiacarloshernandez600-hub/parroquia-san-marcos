import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';

export const metadata = { title: 'Eventos y Avisos | Parroquia San Marcos Evangelista' };

export default async function EventosPage() {
  const db = supabaseAdmin();
  const { data: eventos } = await db.from('eventos').select('*')
    .order('fecha', { ascending: true, nullsFirst: false })
    .order('orden', { ascending: true });

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion reveal">
          <h2>Eventos y Avisos Parroquiales</h2>
          <p>Fiestas patronales, novenas, jornadas, retiros y demás celebraciones especiales de la comunidad.</p>
        </div>

        <div className="grid-cards">
          {(eventos ?? []).map((ev) => (
            <div className="card-item reveal" key={ev.id}>
              {ev.imagen && <img src={publicUrl(ev.imagen)} alt={ev.titulo} />}
              <div className="card-body">
                <h3>{ev.titulo}</h3>
                {ev.fecha && <div className="meta">📅 {ev.fecha}{ev.hora ? ' - ' + ev.hora : ''}</div>}
                <p style={{ whiteSpace: 'pre-line' }}>{ev.descripcion}</p>
              </div>
            </div>
          ))}
          {(!eventos || eventos.length === 0) && <p>Próximamente se publicarán los eventos y avisos parroquiales.</p>}
        </div>
      </div>
    </section>
  );
}
