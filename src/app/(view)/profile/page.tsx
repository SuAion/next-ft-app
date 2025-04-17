'use client';

import { Suspense, use } from 'react';
import I18nWrapper from '@/hoc/I18nWrapper';
import UserProfileCard from '@/app/ui-components/Display/Profile/UserProfileCard';
import OrderHistory from '@/app/ui-components/Display/Profile/OrderHistory';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 用户信息卡片 - 玻璃拟态效果 */}
        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg p-6 mb-8 border border-white/30">
          <UserProfileCard />
        </div>

        {/* 双栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 订单记录 */}
          <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-lg p-6 border border-white/30">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">我的订单</h2>
            <OrderHistory />
          </div>
        </div>

        {/* 国际化包装 */}
        {/* <I18nWrapper> */}
        {/* 其他客户端组件可以放在这里 */}
        {/* </I18nWrapper> */}
      </div>
    </div>
  );
}
