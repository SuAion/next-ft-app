// src/actions/fetchUserData.ts

// 定义用户数据的类型

interface Blog {
    id: string
    title: string
    author: string
    category: string
    date: string
}
// 新增：获取用户列表
export async function fetchBlogs(): Promise<Blog[]> {
    try {
        const response = await fetch('/api/blogs');
        if (!response.ok) {
            throw new Error(`网络错误: ${response.statusText}`);
        }
        const data: Blog[] = await response.json();
        return data;
    } catch (error) {
        console.error("获取用户列表失败:", error);
        throw error;
    }
}