// 'use client'
// import ServerSideCp from "@/components/ServerSideCp";
// import { useTranslation } from "react-i18next";
// export default function Page() {
//   const { t, i18n } = useTranslation();
//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng); // 切换语言
//   };
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <h1>{t('copy_button')}</h1>
//       <button onClick={() => changeLanguage('en')}>English</button>
//       <button onClick={() => changeLanguage('fr')}>Français</button>
//     </div>
//   );
// }

import ClientSideCp from "@/components/ClientSideCp";
import ServerSideCp from "@/components/ServerSideCp";

export default async function Home() {
  let blogs = [];
  try {
    // 添加超时控制
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5秒超时

    const response = await fetch('https://api.vercel.app/blog', {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    blogs = await response.json();
  } catch (error) {
    console.error('数据获取失败:', error);
    // 返回空数据或默认数据，确保构建成功
    blogs = [];
  }

  return (
    <div>
      <ClientSideCp initialPosts={blogs} />
      <ServerSideCp />
    </div>
  );
}

