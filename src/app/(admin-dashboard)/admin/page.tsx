// app/admin/page.tsx
import { prisma } from '@/lib/prisma';

// 统计卡片SVG图标
const PostsStatsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const UsersStatsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const ActivityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

// 统计卡片组件
const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-start gap-4">
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

// 最近活动组件
const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-medium mb-4">最近活动</h2>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
          <div>
            <p className="font-medium">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default async function AdminDashboard() {
  // 获取统计数据
  const postsCount = await prisma.post.count();
  const usersCount = await prisma.user.count();

  // 模拟最近活动数据
  const recentActivities = [
    { title: '新用户注册', time: '今天 10:30' },
    { title: '发布了新文章', time: '昨天 15:45' },
    { title: '系统更新', time: '2天前' },
    { title: '新评论', time: '3天前' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">控制面板</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="文章总数" value={postsCount} icon={<PostsStatsIcon />} color="bg-blue-100 text-blue-600" />
        <StatsCard title="用户总数" value={usersCount} icon={<UsersStatsIcon />} color="bg-green-100 text-green-600" />
        <StatsCard title="今日活跃度" value="87%" icon={<ActivityIcon />} color="bg-purple-100 text-purple-600" />
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近活动 */}
        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivities} />
        </div>

        {/* 欢迎信息 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">欢迎使用CMS管理系统</h2>
          <p className="text-gray-600 mb-4">这是一个功能完善的内容管理系统，您可以在这里管理文章、用户和系统设置。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="font-medium flex items-center gap-2">
                <PostsStatsIcon />
                <span>管理文章</span>
              </h3>
              <p className="text-sm text-gray-500 mt-2">创建、编辑和删除文章内容</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
              <h3 className="font-medium flex items-center gap-2">
                <UsersStatsIcon />
                <span>管理用户</span>
              </h3>
              <p className="text-sm text-gray-500 mt-2">管理用户账号和权限设置</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
