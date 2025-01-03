// ClientSideCp.tsx
"use client";

import { useEffect } from "react";
import { baseStore } from "@/store/baseStore";
import { useTranslation } from 'react-i18next';
export default function ClientSideCp({ initialPosts }) {
  const count = baseStore(state => state.count)
  const posts = baseStore((state) => state.posts);
  const setPosts = baseStore((state) => state.setPosts);


  const { t, i18n } = useTranslation(); // 获取 t 函数和 i18n 对象
  // console.log('=======>i18n', i18n)
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // 切换语言
  };

  useEffect(() => {
    if (posts.length === 0) {
      setPosts(initialPosts); // 初始化 Zustand 状态
    }
  }, [initialPosts, posts, setPosts]);

  return (
    <div>
      <p>{count}</p>
      <div className="text-center mt-10 ">
        <h1>{t('aigc_challenage_compete_filter_hot')}</h1>
        <p>{t('description')}</p>
        <button className="mr-10" onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('fr')}>Français</button>
      </div>
      {posts.length > 0 ? (
        posts.map((post) => <div key={post.id}>{post.title}</div>)
      ) : (
        <p>没有数据</p>
      )}
    </div>
  );
}
