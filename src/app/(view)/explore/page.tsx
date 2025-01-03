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
  const response = await fetch('https://api.vercel.app/blog');
  const blogs = await response.json();

  return (
    <div>
      <ClientSideCp initialPosts={blogs} />
      <ServerSideCp />
    </div>
  );
}

