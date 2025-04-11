"use client";
import { globalStore } from '@/store/globalStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useLayoutEffect, useState } from 'react';

export default function BottomNav() {
  const [isClient, setIsClient] = useState(false);
  const isMobile = globalStore(state => state.isMobile)
  const setIsMobile = globalStore(state => state.setIsMobile)


  const handle_resize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }

  useEffect(() => {
    setIsClient(true);
    // 在这里执行客户端特有的副作用
    // 例如：添加事件监听器、初始化第三方库等
    return () => {
      // 清理副作用
    };
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', handle_resize)
    return () => {
      window.removeEventListener('resize', handle_resize)
    }
  }, [isMobile])


  const pathname = usePathname()

  if (!isMobile) {
    return null
  }

  if (pathname === '/login' || pathname === '/register' || pathname === '/reset-password') {
    return null
  }

  if (!isClient) {
    // 在服务端渲染时返回一个占位元素
    return <div className="bottom-nav-placeholder"></div>;
  }



  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
      <div className="flex justify-around py-2">
        <Link
          href="/"
          className={`flex flex-col items-center p-2 ${pathname === '/' ? 'text-pink-500' : 'text-gray-500'}`}
        >
          <span className="text-xs">首页</span>
        </Link>
        <Link
          href="/explore"
          className={`flex flex-col items-center p-2 ${pathname === '/explore' ? 'text-pink-500' : 'text-gray-500'}`}
        >
          <span className="text-xs">探索</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center p-2 ${pathname === '/profile' ? 'text-pink-500' : 'text-gray-500'}`}
        >
          <span className="text-xs">我的</span>
        </Link>
      </div>
    </nav>
  )
}

