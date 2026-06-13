import { cookies } from 'next/headers';
import crypto from 'crypto';

export const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'Falta la variable de entorno ADMIN_SESSION_SECRET. Defínela en .env.local / Vercel ' +
      '(puede ser cualquier texto largo y aleatorio).'
    );
  }
  return secret;
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

// Crea un token firmado: base64(payload).base64(firma)
export function signSession(payload) {
  const data = JSON.stringify({ ...payload, exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const dataB64 = base64url(data);
  const sig = crypto.createHmac('sha256', getSecret()).update(dataB64).digest('base64url');
  return `${dataB64}.${sig}`;
}

// Verifica y decodifica un token. Devuelve null si no es válido o expiró.
export function verifySession(token) {
  if (!token || !token.includes('.')) return null;
  const [dataB64, sig] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', getSecret()).update(dataB64).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(dataB64, 'base64url').toString('utf-8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Para usar en Server Components / páginas: obtiene la sesión actual (o null)
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

// Para usar en Route Handlers / Server Actions: establece la cookie de sesión
export async function setSessionCookie(payload) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signSession(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

// Para usar en Route Handlers / Server Actions: borra la cookie de sesión
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
