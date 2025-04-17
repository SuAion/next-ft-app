// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/api', '/login', '/register'];
const ADMIN_LOGIN_PATH = '/loginAdmin';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 公共路径直接放行
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path)) || pathname.startsWith(ADMIN_LOGIN_PATH)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  // 处理后台路由
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/loginAdmin', req.url));
    }
    try {
      const payload = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      // 这里可以添加管理员角色验证
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/loginAdmin', req.url));
    }
  }

  // 处理前台需要登录的路由
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/explore'],
};
