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



/** @用户_获取用户列表 **/
export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            throw new Error(`网络错误: ${response.statusText}`);
        }
        const data: User[] = await response.json();
        return data;
    } catch (error) {
        console.error("获取用户列表失败:", error);
        throw error;
    }
}

/** @用户_登录 **/
export async function Signup(inputData: FormData) {
    const formData = new FormData();
    formData.append('email', inputData.get('email') || '');
    formData.append('password', inputData.get('password') || '');
    try {
        const response = await fetch('/api/user', {
            method: 'PUT',
            body: formData,
        });

        const data: User = await response.json();
        return data;
    } catch (error) {
        console.error("获取用户数据失败:", error);
        throw error; // 重新抛出错误以便调用者处理
    }
}


/** @用户_注册 **/
export async function RegisUser(inputData: FormData) {
    const formData = new FormData();
    formData.append('email', inputData.get('email') || '');
    formData.append('password', inputData.get('password') || '');
    try {
        const response = await fetch('/api/user', {
            method: 'PUT',
            body: formData,
        });

        const data: User = await response.json();
        return data;
    } catch (error) {
        console.error("获取用户数据失败:", error);
        throw error; // 重新抛出错误以便调用者处理
    }
}

/** @用户_删除用户 **/
export async function deleteUser(userId: string): Promise<void> {
    try {
        const response = await fetch(`/api/user/${userId}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`网络错误: ${response.statusText}`);
        }
    } catch (error) {
        console.error("删除用户失败:", error);
        throw error;
    }
}

/** @用户_更新用户 **/
export async function updateUser(userId: string, inputData: FormData): Promise<User> {
    try {
        const response = await fetch(`/api/user/${userId}`, {
            method: 'PUT',
            body: inputData,
        });
        if (!response.ok) {
            throw new Error(`网络错误: ${response.statusText}`);
        }
        const data: User = await response.json();
        return data;
    } catch (error) {
        console.error("更新用户失败:", error);
        throw error;
    }
}