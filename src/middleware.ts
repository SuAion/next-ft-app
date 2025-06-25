// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// 路径配置
// 路径配置 - 根据新的路由分组优化
const PUBLIC_PATHS = ['/api', '/login', '/register', '/', '/explore'];
const ADMIN_PATHS = ['/admin'];
const ADMIN_PUBLIC_PATHS = ['/loginAdmin', '/preData']; // 后台公开页面
const CLIENT_PROTECTED_PATHS = ['/profile', '/chat']; // 客户端需登录页面

interface JWTPayload {
  id: string;
  email: string;
  isAdmin: boolean;
  exp: number;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 静态资源和公共 API 路径直接放行
  if (pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.includes('.')) {
    return NextResponse.next();
  }

  // 公共路径和后台公开路径直接放行
  if (PUBLIC_PATHS.some((path) => pathname === path || (path !== '/' && pathname.startsWith(path))) ||
    ADMIN_PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  // 处理管理员路由
  if (ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/loginAdmin', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)) as { payload: JWTPayload };

      // 验证管理员权限
      if (!payload.isAdmin) {
        const response = NextResponse.redirect(new URL('/loginAdmin', req.url));
        response.cookies.delete('token'); // 清除无效token
        return response;
      }

      // 检查 token 是否即将过期 (剩余时间少于1小时)
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp - currentTime < 3600) {
        // 可以在这里添加 token 刷新逻辑
        console.warn('管理员 token 即将过期');
      }

      return NextResponse.next();
    } catch (error) {
      console.error('管理员 token 验证失败:', error);
      const response = NextResponse.redirect(new URL('/loginAdmin', req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // 处理需要登录的前台路由
  if (CLIENT_PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)) as { payload: JWTPayload };

      // 检查 token 是否即将过期
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp - currentTime < 3600) {
        console.warn('用户 token 即将过期');
      }

      return NextResponse.next();
    } catch (error) {
      console.error('用户 token 验证失败:', error);
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // 其他路径正常通过
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
