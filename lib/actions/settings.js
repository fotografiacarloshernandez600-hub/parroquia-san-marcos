'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAdminSession } from '@/lib/auth';

const CAMPOS_SETTINGS = [
  'direccion', 'telefono', 'email', 'facebook',
  'lat_iglesia', 'lng_iglesia', 'historia', 'mision', 'vision', 'patrono',
];

export async function updateSettingsAction(formData) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const db = supabaseAdmin();
  const rows = CAMPOS_SETTINGS.map((clave) => ({
    clave,
    valor: String(formData.get(clave) ?? '').trim(),
  }));

  await db.from('settings').upsert(rows, { onConflict: 'clave' });

  revalidatePath('/admin/ajustes');
  revalidatePath('/');
  revalidatePath('/nosotros');
  revalidatePath('/contacto');
  redirect('/admin/ajustes?ok=1');
}

export async function changePasswordAction(formData) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const actual = String(formData.get('actual') || '');
  const nueva = String(formData.get('nueva') || '');
  const confirmar = String(formData.get('confirmar') || '');

  const db = supabaseAdmin();
  const { data: user } = await db.from('admin_users').select('*').eq('id', session.id).single();

  if (!user) redirect('/admin/login');

  const valido = await bcrypt.compare(actual, user.password_hash);
  if (!valido) {
    redirect('/admin/password?error=' + encodeURIComponent('La contraseña actual no es correcta.'));
  }
  if (nueva.length < 6) {
    redirect('/admin/password?error=' + encodeURIComponent('La nueva contraseña debe tener al menos 6 caracteres.'));
  }
  if (nueva !== confirmar) {
    redirect('/admin/password?error=' + encodeURIComponent('Las contraseñas no coinciden.'));
  }

  const hash = await bcrypt.hash(nueva, 10);
  await db.from('admin_users').update({ password_hash: hash }).eq('id', session.id);

  redirect('/admin/password?ok=1');
}
