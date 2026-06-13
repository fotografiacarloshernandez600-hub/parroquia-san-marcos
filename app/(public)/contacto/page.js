import { getSettings } from '@/lib/settings';
import MapaContacto from '@/app/components/MapaContacto';

export const metadata = { title: 'Contacto y Ubicación | Parroquia San Marcos Evangelista' };

export default async function ContactoPage() {
  const settings = await getSettings();
  const lat = parseFloat(settings.lat_iglesia) || 18.39611;
  const lng = parseFloat(settings.lng_iglesia) || -93.21278;

  return (
    <section className="contenido">
      <div className="container">
        <div className="titulo-seccion reveal">
          <h2>Contacto y Ubicación</h2>
        </div>
        <div className="tarjetas">
          <div className="tarjeta">
            <h3>📍 Dirección</h3>
            <p>{settings.direccion}</p>
          </div>
          <div className="tarjeta">
            <h3>📞 Teléfono</h3>
            <p>{settings.telefono}</p>
          </div>
          <div className="tarjeta">
            <h3>✉️ Correo</h3>
            <p>{settings.email}</p>
          </div>
          <div className="tarjeta">
            <h3>📘 Redes sociales</h3>
            <p><a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></p>
          </div>
        </div>

        <MapaContacto lat={lat} lng={lng} />
      </div>
    </section>
  );
}
