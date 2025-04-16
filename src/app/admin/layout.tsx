// app/admin/layout.tsx
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const SECRET = process.env.JWT_SECRET || 'secret'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/login')

  let user = null

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string }
    user = await prisma.user.findUnique({ where: { id: decoded.id } })
  } catch (e) {
    redirect('/login')
  }

  // if (!user?.isAdmin) {
  //   redirect('/') // 非管理员跳回首页
  // }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">后台管理</div>
        <nav className="flex flex-col space-y-2 p-4 text-sm">
          <Link href="/admin/posts" className="hover:text-gray-300">文章管理</Link>
          <Link href="/admin/users" className="hover:text-gray-300">用户管理</Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center p-4 border-b bg-white shadow">
          <div>👋 欢迎，{user.name || user.email}</div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-sm text-red-500 hover:underline">退出登录</button>
          </form>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
