import { getSettings } from '@/lib/settings';

export const metadata = { title: 'La Parroquia | Parroquia San Marcos Evangelista' };

export default async function NosotrosPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="contenido">
        <div className="container">
          <div className="titulo-seccion reveal">
            <h2>Sobre nuestra Parroquia</h2>
          </div>
          <div className="tarjeta reveal">
            <h3>Nuestra historia</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{settings.historia}</p>
          </div>
        </div>
      </section>

      <section className="contenido alt">
        <div className="container">
          <div className="tarjetas">
            <div className="tarjeta reveal">
              <h3>Misión</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{settings.mision}</p>
            </div>
            <div className="tarjeta reveal">
              <h3>Visión</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{settings.vision}</p>
            </div>
            <div className="tarjeta reveal">
              <h3>San Marcos Evangelista</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{settings.patrono}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
