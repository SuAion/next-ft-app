// app/(admin)/posts/new/page.tsx
'use client';

import { useState } from 'react';
import { postService } from '@/service';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    await postService.create({ title, content });
    router.push('/admin/posts');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">新建博客</h1>
      <input
        placeholder="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 h-40 rounded"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        提交
      </button>
    </div>
  );
}
