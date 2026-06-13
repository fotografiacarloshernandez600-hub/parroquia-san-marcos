import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { setSessionCookie } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  const usuario = String(body.usuario || '').trim();
  const password = String(body.password || '');

  if (!usuario || !password) {
    return Response.json({ error: 'Usuario y contraseña son obligatorios.' }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: user, error } = await db.from('admin_users').select('*').eq('usuario', usuario).single();

  if (error || !user) {
    return Response.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
  }

  const valido = await bcrypt.compare(password, user.password_hash);
  if (!valido) {
    return Response.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
  }

  await setSessionCookie({ id: user.id, usuario: user.usuario, nombre: user.nombre });

  return Response.json({ ok: true });
}
