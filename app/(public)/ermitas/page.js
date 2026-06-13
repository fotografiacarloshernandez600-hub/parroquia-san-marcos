import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';
import MapaErmitas from '@/app/components/MapaErmitas';

export const metadata = { title: 'Ermitas | Parroquia San Marcos Evangelista' };

export default async function ErmitasPage() {
  const db = supabaseAdmin();
  const { data: ermitas } = await db.from('ermitas').select('*').order('orden', { ascending: true });
  const lista = ermitas ?? [];

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion reveal">
          <h2>Ermitas de la Parroquia</h2>
          <p>Estas son las ermitas y capillas que pertenecen a nuestra parroquia, ubicadas en distintas comunidades. Da clic en cada marcador del mapa para conocer más sobre cada una.</p>
        </div>

        <MapaErmitas ermitas={lista} />

        <div className="grid-cards mt-2">
          {lista.map((erm) => (
            <div className="card-item reveal" key={erm.id}>
              {erm.imagen && <img src={publicUrl(erm.imagen)} alt={erm.nombre} />}
              <div className="card-body">
                <h3>{erm.nombre}</h3>
                {erm.ubicacion_texto && <div className="meta">📍 {erm.ubicacion_texto}</div>}
                <p style={{ whiteSpace: 'pre-line' }}>{erm.descripcion}</p>
              </div>
            </div>
          ))}
          {lista.length === 0 && <p>Próximamente se publicará la lista de ermitas.</p>}
        </div>
      </div>
    </section>
  );
}
