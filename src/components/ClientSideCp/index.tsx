// ClientSideCp.tsx
"use client";

import { useEffect } from "react";
import { baseStore } from "@/store/baseStore";

export default function ClientSideCp({ initialPosts }) {
  const count = baseStore(state => state.count)
  const posts = baseStore((state) => state.posts);
  const setPosts = baseStore((state) => state.setPosts);

  useEffect(() => {
    if (posts.length === 0) {
      setPosts(initialPosts); // 初始化 Zustand 状态
    }
  }, [initialPosts, posts, setPosts]);

  return (
    <div>
      <p>{count}</p>
      {posts.length > 0 ? (
        posts.map((post) => <div key={post.id}>{post.title}</div>)
      ) : (
        <p>没有数据</p>
      )}
    </div>
  );
}
