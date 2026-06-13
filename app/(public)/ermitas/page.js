import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';
import MapaErmitas from '@/app/components/MapaErmitas';
import ErmitasLista from '@/app/components/ErmitasLista';

export const metadata = { title: 'Ermitas | Parroquia San Marcos Evangelista' };

export default async function ErmitasPage() {
  const db = supabaseAdmin();
  const { data: ermitas } = await db.from('ermitas').select('*').order('orden', { ascending: true });
  const lista = ermitas ?? [];

  // Resolvemos la URL pública de la imagen aquí (en el servidor) para
  // pasársela ya lista al componente cliente del buscador.
  const listaConUrl = lista.map((e) => ({ ...e, imagenUrl: publicUrl(e.imagen) }));

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion reveal">
          <span className="eyebrow">Comunidades</span>
          <h2>Ermitas de la Parroquia</h2>
          <p>Estas son las ermitas y capillas que pertenecen a nuestra parroquia, ubicadas en distintas comunidades. Da clic en cada marcador del mapa para conocer más sobre cada una.</p>
        </div>

        <MapaErmitas ermitas={lista} />

        <ErmitasLista ermitas={listaConUrl} />
      </div>
    </section>
  );
}
