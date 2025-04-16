import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
    '/profile',
    '/login',
    '/register',
]

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    console.log('=======>Middleware triggered for path:', request.nextUrl.pathname)
    console.log('=======>Token:', token)
    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        console.log('=======>Protected route accessed:', request.nextUrl.pathname)
        // if (!token) {
        //     return NextResponse.redirect(new URL('/login', request.url))
        // }
        // 这里可以添加token验证逻辑
        // 例如调用API验证token有效性
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}