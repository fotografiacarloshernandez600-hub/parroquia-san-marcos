'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAdminSession } from '@/lib/auth';
import { getTabla } from '@/lib/tablesConfig';

const ALLOWED_IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const RUTAS_PUBLICAS = {
  horarios_misa: ['/', '/horarios'],
  horarios_oficina: ['/horarios'],
  sacramentos: ['/sacramentos'],
  grupos: ['/grupos'],
  ermitas: ['/ermitas'],
  eventos: ['/', '/eventos'],
  galeria: ['/galeria'],
  calendario_liturgico: ['/calendario'],
  clero: ['/sacerdotes'],
};

function revalidarPublicas(table) {
  for (const ruta of RUTAS_PUBLICAS[table] || []) revalidatePath(ruta);
}

export async function saveRecordAction(table, formData) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const conf = getTabla(table);
  if (!conf) redirect('/admin');

  const db = supabaseAdmin();
  const id = parseInt(formData.get('id') || '0', 10);
  const datos = {};
  let errorMsg = null;

  for (const [name, def] of Object.entries(conf.campos)) {
    if (def.tipo === 'image') {
      const file = formData.get(name);
      if (file && typeof file === 'object' && file.size > 0) {
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        if (!ALLOWED_IMAGE_EXT.includes(ext)) {
          errorMsg = `Formato de imagen no permitido para "${def.label}". Usa JPG, PNG o WEBP.`;
          break;
        }
        if (file.size > MAX_SIZE) {
          errorMsg = `La imagen de "${def.label}" supera el tamaño máximo (5 MB).`;
          break;
        }
        const path = `${def.carpeta}/${crypto.randomUUID()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const { error: errUpload } = await db.storage.from('uploads').upload(path, buffer, {
          contentType: file.type || undefined,
        });
        if (errUpload) {
          errorMsg = `No se pudo subir la imagen de "${def.label}".`;
          break;
        }
        // borrar imagen anterior si estamos editando
        if (id > 0) {
          const { data: actual } = await db.from(table).select(name).eq('id', id).single();
          if (actual && actual[name]) {
            await db.storage.from('uploads').remove([actual[name]]);
          }
        }
        datos[name] = path;
      } else if (formData.get(`quitar_${name}`) === '1') {
        if (id > 0) {
          const { data: actual } = await db.from(table).select(name).eq('id', id).single();
          if (actual && actual[name]) {
            await db.storage.from('uploads').remove([actual[name]]);
          }
        }
        datos[name] = null;
      }
      continue;
    }

    let val = String(formData.get(name) ?? '').trim();
    if (def.tipo === 'number') {
      datos[name] = val === '' ? 0 : parseInt(val, 10);
    } else if (name === 'lat' || name === 'lng') {
      datos[name] = val === '' ? null : parseFloat(val);
    } else if (def.tipo === 'date') {
      datos[name] = val === '' ? null : val;
    } else {
      datos[name] = val;
    }

    if (def.requerido && val === '') {
      errorMsg = `El campo "${def.label}" es obligatorio.`;
    }
  }

  if (errorMsg) {
    const destino = id > 0 ? `/admin/manage/${table}/${id}` : `/admin/manage/${table}/new`;
    redirect(`${destino}?error=${encodeURIComponent(errorMsg)}`);
  }

  if (id > 0) {
    await db.from(table).update(datos).eq('id', id);
  } else {
    await db.from(table).insert(datos);
  }

  revalidarPublicas(table);
  revalidatePath(`/admin/manage/${table}`);
  redirect(`/admin/manage/${table}?ok=1`);
}

export async function deleteRecordAction(table, id) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const conf = getTabla(table);
  if (!conf) redirect('/admin');

  const db = supabaseAdmin();

  // borrar imágenes asociadas en storage
  for (const [name, def] of Object.entries(conf.campos)) {
    if (def.tipo === 'image') {
      const { data: actual } = await db.from(table).select(name).eq('id', id).single();
      if (actual && actual[name]) {
        await db.storage.from('uploads').remove([actual[name]]);
      }
    }
  }

  await db.from(table).delete().eq('id', id);

  revalidarPublicas(table);
  revalidatePath(`/admin/manage/${table}`);
  redirect(`/admin/manage/${table}?ok=2`);
}
