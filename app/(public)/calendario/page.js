import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { COLORES_LITURGICOS_HEX } from '@/lib/tablesConfig';
import { formatFechaCorta } from '@/lib/format';

export const metadata = { title: 'Calendario Litúrgico | Parroquia San Marcos Evangelista' };

export default async function CalendarioPage() {
  const db = supabaseAdmin();
  const hoy = new Date().toISOString().slice(0, 10);

  const { data: proximos } = await db.from('calendario_liturgico').select('*')
    .gte('fecha', hoy)
    .order('fecha', { ascending: true })
    .order('orden', { ascending: true });

  const { data: pasados } = await db.from('calendario_liturgico').select('*')
    .lt('fecha', hoy)
    .order('fecha', { ascending: false })
    .order('orden', { ascending: true })
    .limit(5);

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion">
          <h2>Calendario Litúrgico</h2>
          <p>Fechas importantes del año litúrgico, tiempos fuertes y celebraciones especiales.</p>
        </div>

        <h3>Próximas fechas</h3>
        {(proximos ?? []).map((it) => (
          <div className="calendario-item" key={it.id}>
            <div className="fecha-box">{formatFechaCorta(it.fecha)}</div>
            <div>
              <strong>{it.titulo}</strong>
              {it.color_liturgico && (
                <span className="color-pill" style={{ background: COLORES_LITURGICOS_HEX[it.color_liturgico] || '#999' }}>
                  {it.color_liturgico}
                </span>
              )}
              {it.descripcion && <p style={{ margin: '6px 0 0', whiteSpace: 'pre-line' }}>{it.descripcion}</p>}
            </div>
          </div>
        ))}
        {(!proximos || proximos.length === 0) && <p>Próximamente se publicará el calendario litúrgico.</p>}

        {pasados && pasados.length > 0 && (
          <>
            <h3 className="mt-2">Fechas recientes</h3>
            {pasados.map((it) => (
              <div className="calendario-item" style={{ opacity: 0.6 }} key={it.id}>
                <div className="fecha-box">{formatFechaCorta(it.fecha)}</div>
                <div>
                  <strong>{it.titulo}</strong>
                  {it.color_liturgico && (
                    <span className="color-pill" style={{ background: COLORES_LITURGICOS_HEX[it.color_liturgico] || '#999' }}>
                      {it.color_liturgico}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
