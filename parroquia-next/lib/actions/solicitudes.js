'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAdminSession } from '@/lib/auth';

export async function updateSolicitudAction(id, formData) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const estado = String(formData.get('estado') || 'Pendiente');
  const notas_admin = String(formData.get('notas_admin') || '').trim();

  const db = supabaseAdmin();
  await db.from('solicitudes').update({ estado, notas_admin }).eq('id', id);

  revalidatePath(`/admin/solicitudes/${id}`);
  revalidatePath('/admin/solicitudes');
  redirect(`/admin/solicitudes/${id}?ok=1`);
}

export async function deleteSolicitudAction(id) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const db = supabaseAdmin();

  const { data: archivos } = await db.from('solicitud_archivos').select('ruta_archivo').eq('solicitud_id', id);
  if (archivos && archivos.length > 0) {
    await db.storage.from('uploads').remove(archivos.map((a) => a.ruta_archivo));
  }

  await db.from('solicitudes').delete().eq('id', id);

  revalidatePath('/admin/solicitudes');
  redirect('/admin/solicitudes?ok=3');
}
