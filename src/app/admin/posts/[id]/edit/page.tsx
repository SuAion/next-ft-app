// app/(admin)/posts/[id]/edit/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPostById, updatePostById } from '@/services/post'

export default function EditPostPage() {
    const { id } = useParams() as { id: string }
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const router = useRouter()

    useEffect(() => {
        getPostById(id).then((post) => {
            setTitle(post.title)
            setContent(post.content)
        })
    }, [id])

    const handleUpdate = async () => {
        await updatePostById(id, { title, content })
        router.push('/posts')
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">编辑博客</h1>
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
            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded">更新</button>
        </div>
    )
}
