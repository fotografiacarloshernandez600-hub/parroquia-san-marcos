import { getSettings } from '@/lib/settings';
import { publicUrl } from '@/lib/supabaseAdmin';
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
  const bannerUrl = settings.banner_inicio ? publicUrl(settings.banner_inicio) : null;

  return (
    <>
      <div className="admin-topbar"><h1>Datos generales del sitio</h1></div>

      {params?.ok && <div className="alerta exito">Datos guardados correctamente.</div>}
      {params?.error && <div className="alerta error">{params.error}</div>}

      <div className="card">
        <form action={updateSettingsAction} encType="multipart/form-data">

          {/* ---- Banner / foto de inicio ---- */}
          <div className="form-grupo" style={{ paddingBottom: 18, borderBottom: '1px solid #e0e0e0', marginBottom: 22 }}>
            <label htmlFor="f_banner">Foto del banner de inicio (portada)</label>
            {bannerUrl && (
              <div style={{ marginBottom: 10 }}>
                <img src={bannerUrl} alt="Banner actual" style={{ width: '100%', maxWidth: 380, borderRadius: 10, display: 'block', marginBottom: 8 }} />
                <label style={{ display: 'inline', fontWeight: 'normal', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="quitar_banner" value="1" style={{ width: 'auto', marginRight: 6 }} />
                  Quitar el banner actual (volver al fondo de color)
                </label>
              </div>
            )}
            <input type="file" name="banner_inicio" id="f_banner" accept=".jpg,.jpeg,.png,.webp" />
            <small>Sube una foto horizontal de la parroquia (recomendado: 1600×900 px o similar). Puedes cambiarla cuando quieras. Formatos: JPG, PNG, WEBP.</small>
          </div>

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
