import { NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Dejar pasar la página de login y el endpoint de login/logout
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/login') ||
    pathname.startsWith('/api/admin/logout')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = verifySession(token);
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
