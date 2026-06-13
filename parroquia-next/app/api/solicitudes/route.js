import { supabaseAdmin } from '@/lib/supabaseAdmin';

const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const CONTENT_TYPES = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', pdf: 'application/pdf',
};

export async function POST(request) {
  const db = supabaseAdmin();

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'No se pudo leer el formulario.' }, { status: 400 });
  }

  const sacramento_id = parseInt(formData.get('sacramento_id'), 10);
  const nombre_solicitante = String(formData.get('nombre_solicitante') || '').trim();
  const nombre_persona = String(formData.get('nombre_persona') || '').trim();
  const telefono = String(formData.get('telefono') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const mensaje = String(formData.get('mensaje') || '').trim();

  if (!sacramento_id || !nombre_solicitante || !telefono) {
    return Response.json({ error: 'Por favor completa los campos obligatorios (*).' }, { status: 400 });
  }

  // 1. Crear la solicitud
  const { data: solicitud, error: errInsert } = await db
    .from('solicitudes')
    .insert({
      sacramento_id, nombre_solicitante, nombre_persona,
      telefono, email, mensaje, estado: 'Pendiente',
    })
    .select()
    .single();

  if (errInsert) {
    return Response.json({ error: 'No se pudo registrar la solicitud. Intenta de nuevo.' }, { status: 500 });
  }

  // 2. Subir comprobantes (si hay)
  const archivos = formData.getAll('comprobantes').filter((f) => f && typeof f === 'object' && f.size > 0);
  const avisos = [];

  for (const file of archivos) {
    const nombreOriginal = file.name || 'archivo';
    const ext = nombreOriginal.split('.').pop().toLowerCase();

    if (!ALLOWED_EXT.includes(ext)) {
      avisos.push(`Formato no permitido para "${nombreOriginal}".`);
      continue;
    }
    if (file.size > MAX_SIZE) {
      avisos.push(`El archivo "${nombreOriginal}" supera el tamaño máximo (5 MB).`);
      continue;
    }

    const path = `comprobantes/${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: errUpload } = await db.storage.from('uploads').upload(path, buffer, {
      contentType: CONTENT_TYPES[ext] || file.type || 'application/octet-stream',
    });

    if (errUpload) {
      avisos.push(`No se pudo subir el archivo "${nombreOriginal}".`);
      continue;
    }

    await db.from('solicitud_archivos').insert({
      solicitud_id: solicitud.id,
      ruta_archivo: path,
      nombre_original: nombreOriginal,
    });
  }

  return Response.json({ ok: true, avisos });
}
