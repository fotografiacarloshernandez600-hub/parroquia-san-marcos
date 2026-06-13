import { getSettings } from '@/lib/settings';
import { updateSettingsAction } from '@/lib/actions/settings';

export const metadata = { title: 'Datos generales | Panel admin' };

const CAMPOS = [
  { name: 'direccion', label: 'Dirección', tipo: 'text' },
  { name: 'telefono', label: 'Teléfono', tipo: 'text' },
  { name: 'email', label: 'Correo electrónico', tipo: 'text' },
  { name: 'facebook', label: 'Enlace de Facebook', tipo: 'text' },
  { name: 'lat_iglesia', label: 'Latitud del templo (para el mapa de Contacto)', tipo: 'text' },
  { name: 'lng_iglesia', label: 'Longitud del templo (para el mapa de Contacto)', tipo: 'text' },
  { name: 'historia', label: 'Historia de la parroquia', tipo: 'textarea', filas: 8 },
  { name: 'mision', label: 'Misión', tipo: 'textarea', filas: 4 },
  { name: 'vision', label: 'Visión', tipo: 'textarea', filas: 4 },
  { name: 'patrono', label: 'San Marcos Evangelista (patrono)', tipo: 'textarea', filas: 4 },
];

export default async function AjustesPage({ searchParams }) {
  const params = await searchParams;
  const settings = await getSettings();

  return (
    <>
      <div className="admin-topbar"><h1>Datos generales del sitio</h1></div>

      {params?.ok && <div className="alerta exito">Datos guardados correctamente.</div>}

      <div className="card">
        <form action={updateSettingsAction}>
          {CAMPOS.map((c) => (
            <div className="form-grupo" key={c.name}>
              <label htmlFor={`f_${c.name}`}>{c.label}</label>
              {c.tipo === 'textarea' ? (
                <textarea name={c.name} id={`f_${c.name}`} rows={c.filas || 4} defaultValue={settings[c.name]} />
              ) : (
                <input type="text" name={c.name} id={`f_${c.name}`} defaultValue={settings[c.name]} />
              )}
            </div>
          ))}
          <button type="submit" className="btn">Guardar cambios</button>
        </form>
      </div>
    </>
  );
}
