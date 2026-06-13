import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';

export const metadata = { title: 'Sacerdotes | Parroquia San Marcos Evangelista' };

export default async function SacerdotesPage() {
  const db = supabaseAdmin();
  const { data: clero } = await db.from('clero').select('*').order('orden', { ascending: true });
  const lista = clero ?? [];

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion reveal">
          <span className="eyebrow">Nuestra comunidad</span>
          <h2>Sacerdotes</h2>
          <p>Quienes acompañan, guían y sirven a nuestra comunidad parroquial.</p>
        </div>

        <div className="clero-grid">
          {lista.map((p, i) => (
            <article className={`clero-card reveal d${(i % 3) + 1}`} key={p.id}>
              <div className="clero-foto">
                {p.imagen ? (
                  <img src={publicUrl(p.imagen)} alt={p.nombre} />
                ) : (
                  <div className="clero-foto-vacia" aria-hidden="true">✝</div>
                )}
              </div>
              <div className="clero-body">
                {p.cargo && <span className="clero-cargo">{p.cargo}</span>}
                <h3>{p.nombre}</h3>
                {p.bio && <p style={{ whiteSpace: 'pre-line' }}>{p.bio}</p>}
              </div>
            </article>
          ))}
          {lista.length === 0 && <p className="reveal">Próximamente publicaremos la información de nuestros sacerdotes.</p>}
        </div>
      </div>
    </section>
  );
}
