import { createClient } from '@supabase/supabase-js';

// Este cliente usa la "service role key" y SOLO debe usarse en el
// servidor (Server Components, Route Handlers, Server Actions).
// NUNCA debe importarse desde un componente 'use client'.
let _client = null;

export function supabaseAdmin() {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY. ' +
      'Configúralas en .env.local (desarrollo) o en Vercel (Project Settings -> Environment Variables).'
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

// Construye la URL pública de un archivo guardado en el bucket "uploads"
export function publicUrl(path) {
  if (!path) return null;
  const url = process.env.SUPABASE_URL;
  if (!url) return null;
  return `${url}/storage/v1/object/public/uploads/${path}`;
}
