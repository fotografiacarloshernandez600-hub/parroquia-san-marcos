import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getSettings } from '@/lib/settings';

export const metadata = { title: 'Horarios | Parroquia San Marcos Evangelista' };

export default async function HorariosPage() {
  const db = supabaseAdmin();
  const settings = await getSettings();
  const { data: misas } = await db.from('horarios_misa').select('*').order('orden', { ascending: true });
  const { data: oficina } = await db.from('horarios_oficina').select('*').order('orden', { ascending: true });

  return (
    <>
      <section className="contenido">
        <div className="container">
          <div className="titulo-seccion">
            <h2>Horarios de Misa</h2>
            <p>Estos son nuestros horarios regulares de celebraciones eucarísticas. Pueden cambiar en fechas especiales; consulta los avisos para confirmaciones.</p>
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
        </div>
      </section>

      <section className="contenido alt">
        <div className="container">
          <div className="titulo-seccion">
            <h2>Atención de Oficina Parroquial</h2>
            <p>Horarios para trámites, solicitudes de constancias, pláticas, y asuntos administrativos.</p>
          </div>
          <table className="horarios">
            <thead><tr><th>Día</th><th>Horario</th><th>Notas</th></tr></thead>
            <tbody>
              {(oficina ?? []).map((o) => (
                <tr key={o.id}>
                  <td>{o.dia}</td>
                  <td>{o.hora_inicio} - {o.hora_fin}</td>
                  <td>{o.notas}</td>
                </tr>
              ))}
              {(!oficina || oficina.length === 0) && (
                <tr><td colSpan={3}>Próximamente se publicará el horario de oficina.</td></tr>
              )}
            </tbody>
          </table>
          <p className="mt-2 text-center">
            📞 {settings.telefono} &nbsp; ✉️ {settings.email}
          </p>
        </div>
      </section>
    </>
  );
}
