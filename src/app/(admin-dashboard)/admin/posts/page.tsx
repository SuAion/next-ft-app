// app/(admin)/posts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { postService } from '@/service';
import { Post } from '@/types/post';
import Link from 'next/link';
import { baseStore } from '@/store/baseStore';

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const setStorePosts = baseStore((state) => state.setPosts);

  useEffect(() => {
    postService.getAll().then((res) => {
      console.log('=======>res', res);
      setPosts(res.data);
      setStorePosts(res.data);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await postService.delete(id);
    setPosts(posts.filter((post) => post.id !== id));
    setStorePosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">博客管理</h1>
        <Link href="/admin/posts/new" className="bg-blue-500 text-white px-4 py-2 rounded">
          新建博客
        </Link>
      </div>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="space-x-2">
              <Link href={`/admin/posts/${post.id}/edit`} className="text-blue-600">
                编辑
              </Link>
              <button onClick={() => handleDelete(post.id)} className="text-red-500">
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
