// src/actions/fetchUserData.ts

// 定义用户数据的类型
export interface User {
    id: string;
    name: string;
    email: string;
    // 其他用户属性
}

// 异步函数用于获取用户数据
export async function fetchUserData(userId: string): Promise<User> {
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`);

        // 检查响应是否成功
        if (!response.ok) {
            throw new Error(`网络错误: ${response.statusText}`);
        }

        const data: User = await response.json();
        return data;
    } catch (error) {
        console.error("获取用户数据失败:", error);
        throw error; // 重新抛出错误以便调用者处理
    }
}