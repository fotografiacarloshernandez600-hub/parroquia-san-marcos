import Link from 'next/link';
import { supabaseAdmin, publicUrl } from '@/lib/supabaseAdmin';

export const metadata = { title: 'Galería | Parroquia San Marcos Evangelista' };

export default async function GaleriaPage({ searchParams }) {
  const params = await searchParams;
  const categoriaFiltro = params?.categoria || '';

  const db = supabaseAdmin();
  let query = db.from('galeria').select('*').order('orden', { ascending: false }).order('id', { ascending: false });
  if (categoriaFiltro) query = query.eq('categoria', categoriaFiltro);
  const { data: fotos } = await query;

  const { data: todas } = await db.from('galeria').select('categoria');
  const categorias = [...new Set((todas ?? []).map((f) => f.categoria).filter(Boolean))].sort();

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion">
          <h2>Galería de Fotos</h2>
          <p>Imágenes de celebraciones, eventos y vida parroquial.</p>
        </div>

        {categorias.length > 0 && (
          <p className="text-center mt-2">
            <Link href="/galeria" className={`boton chico ${categoriaFiltro === '' ? '' : 'secundario'}`}>Todas</Link>{' '}
            {categorias.map((cat) => (
              <Link key={cat} href={`/galeria?categoria=${encodeURIComponent(cat)}`} className={`boton chico ${categoriaFiltro === cat ? '' : 'secundario'}`}>
                {cat}
              </Link>
            ))}
          </p>
        )}

        <div className="galeria-grid mt-2">
          {(fotos ?? []).map((f) => (
            <figure key={f.id}>
              <img src={publicUrl(f.imagen)} alt={f.titulo || ''} loading="lazy" />
              {f.titulo && <figcaption>{f.titulo}</figcaption>}
            </figure>
          ))}
        </div>
        {(!fotos || fotos.length === 0) && <p className="text-center">Próximamente compartiremos fotos de nuestra comunidad.</p>}
      </div>
    </section>
  );
}
