import { supabaseAdmin } from '@/lib/supabaseAdmin';

const DEFAULTS = {
  direccion: '',
  telefono: '',
  email: '',
  facebook: '',
  lat_iglesia: '18.39611',
  lng_iglesia: '-93.21278',
  historia: '',
  mision: '',
  vision: '',
  patrono: '',
  banner_inicio: '',
  // Transmisiones en vivo
  vivo_facebook_url: '',   // enlace de la transmisión/página de Facebook de la parroquia
  vivo_papa_url: '',       // enlace de YouTube de la misa del Papa / Vaticano
  vivo_mexico_url: '',     // enlace de YouTube de la misa de México
};

// Devuelve un objeto { clave: valor } con todos los settings (con valores por defecto)
export async function getSettings() {
  const { data, error } = await supabaseAdmin().from('settings').select('clave, valor');
  const out = { ...DEFAULTS };
  if (!error && data) {
    for (const row of data) {
      out[row.clave] = row.valor ?? '';
    }
  }
  return out;
}
