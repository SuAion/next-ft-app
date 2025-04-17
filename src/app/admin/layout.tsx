// app/admin/layout.tsx
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const SECRET = process.env.JWT_SECRET || 'secret';

// SVG图标组件
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const PostsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) redirect('/admin/loginAdmin');

  let user = null;

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };
    user = await prisma.user.findUnique({ where: { id: decoded.id } });
  } catch (e) {
    redirect('/login');
  }

  // 权限控制：只有管理员可以访问后台
  // if (!user?.isAdmin) {
  //   redirect('/'); // 非管理员跳回首页
  // }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
        <div className="p-5 text-xl font-bold border-b border-gray-700 flex items-center gap-2">
          <DashboardIcon />
          <span>后台管理系统</span>
        </div>
        <nav className="flex flex-col p-4 text-sm">
          <Link
            href="/admin"
            className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-800 transition-colors mb-1"
          >
            <DashboardIcon />
            <span>控制面板</span>
          </Link>
          <Link
            href="/admin/posts"
            className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-800 transition-colors mb-1"
          >
            <PostsIcon />
            <span>文章管理</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            <UsersIcon />
            <span>用户管理</span>
          </Link>
        </nav>
        <div className="mt-auto p-4 border-t border-gray-700 text-xs text-gray-400">
          © {new Date().getFullYear()} CMS管理系统
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{user.name || user.email}</div>
              <div className="text-xs text-gray-500">{user.isAdmin ? '管理员' : '普通用户'}</div>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST" className="flex items-center">
            <button
              type="submit"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogoutIcon />
              <span>退出登录</span>
            </button>
          </form>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
