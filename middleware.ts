import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 不保護的路由（白名單）
  const publicPaths = ['/', '/login', '/register', '/favicon.ico', '/api/login', '/api/register'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 取得 Cookie 裡的 token
  const token = req.cookies.get('token')?.value;
  if (!token) {
    // 沒有 token 就導向登入頁
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 驗證 token
  const payload = verifyToken(token);
  if (!payload) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 你可以把 userId 放進 header 或 req.nextUrl.searchParams 傳給後端 API
  // 這裡示範 header
  const res = NextResponse.next();
  res.headers.set('x-user-id', (payload as any).userId);

  return res;
}

// 指定 middleware 作用範圍
export const config = {
  matcher: ['/settings/:path*', '/profile/:path*', '/dashboard/:path*'],
};

