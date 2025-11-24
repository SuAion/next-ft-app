'use client';
import { I18nextProvider } from 'react-i18next';
import { ReactNode, useEffect, useState } from 'react';
import i18n from '@/locales/i18n';
import { getCookie } from '@/utils';

interface I18nWrapperProps {
  children: ReactNode;
  // 可选的服务端传递的语言
  lng?: string;
}

export default function I18nWrapper({ children, lng }: I18nWrapperProps) {
  // 客户端准备状态 - 关键：防止水合错误
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 标记客户端已准备
    setIsClient(true);

    // 检测并设置用户语言偏好
    let targetLng = lng; // 优先使用服务端传递的语言

    if (!targetLng) {
      // 尝试从 cookie 获取
      const cookieLng = getCookie('locale');
      if (cookieLng) {
        // 转换语言格式：zh_CN -> cn
        const langKey = cookieLng.replace('_', '').toLowerCase();
        targetLng = langKey.includes('zh') ? (cookieLng.includes('TW') ? 'tw' : 'cn') : 'en';
      } else if (typeof window !== 'undefined') {
        // 从浏览器语言检测
        const browserLng = navigator.language.toLowerCase();
        if (browserLng.includes('zh')) {
          targetLng = browserLng.includes('tw') || browserLng.includes('hk') ? 'tw' : 'cn';
        } else {
          targetLng = 'en';
        }
      }
    }

    // 只有当语言不同时才切换，避免不必要的重新渲染
    if (targetLng && i18n.language !== targetLng) {
      i18n.changeLanguage(targetLng);
    }
  }, [lng]);

  // 在客户端准备好之前，使用默认语言避免水合错误
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
