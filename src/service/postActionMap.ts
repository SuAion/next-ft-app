// services/post.ts
import { Post } from '@/types/post'

const API_URL = '/api/posts'

export const getAllPosts = async (): Promise<Post[]> => {
    const res = await fetch(API_URL)
    return res.json()
}

export const getPostById = async (id: string): Promise<Post> => {
    const res = await fetch(`${API_URL}/${id}`)
    return res.json()
}

export const createPost = async (data: Partial<Post>) => {
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
}

export const updatePostById = async (id: string, data: Partial<Post>) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
}

export const deletePostById = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
}
