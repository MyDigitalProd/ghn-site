import { NextResponse } from 'next/server';

// Middleware: persiste ?lang=xx en cookie pour SSR sans changer le routing
export function middleware(req: Request) {
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang');
  if (lang) {
    const res = NextResponse.next();
    // 1 an
    res.cookies.set('lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  }
  return NextResponse.next();
}

export const config = { matcher: '/:path*' };
