import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';

export const metadata = { title: 'Grupos y Movimientos | Parroquia San Marcos Evangelista' };

export default async function GruposPage() {
  const db = supabaseAdmin();
  const { data: grupos } = await db.from('grupos').select('*').order('orden', { ascending: true });

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion reveal">
          <h2>Grupos y Movimientos Parroquiales</h2>
          <p>Conoce los grupos de catequesis, pastoral, oración y servicio de nuestra comunidad. Si deseas integrarte a alguno, acércate en su horario de reunión o visita la oficina parroquial.</p>
        </div>

        <div className="grid-cards">
          {(grupos ?? []).map((g) => (
            <div className="card-item reveal" key={g.id}>
              {g.imagen && <img src={publicUrl(g.imagen)} alt={g.nombre} />}
              <div className="card-body">
                <h3>{g.nombre}</h3>
                {g.horario && <div className="meta">🕐 {g.horario}</div>}
                <p style={{ whiteSpace: 'pre-line' }}>{g.descripcion}</p>
                {g.contacto && <p><strong>Contacto:</strong> {g.contacto}</p>}
              </div>
            </div>
          ))}
          {(!grupos || grupos.length === 0) && <p>Próximamente se publicará la información de los grupos parroquiales.</p>}
        </div>
      </div>
    </section>
  );
}
