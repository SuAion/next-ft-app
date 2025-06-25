// 用户服务 - 重构后的标准化实现
import request from '@/lib/request';
import {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ApiResponse
} from '@/types';

/**
 * 用户服务 - 统一的用户相关API
 */
export const userService = {
    /**
     * 获取用户列表
     */
    async getList(): Promise<ApiResponse<User[]>> {
        return request({
            url: '/api/user',
            method: 'GET',
        });
    },

    /**
     * 获取单个用户信息
     */
    async getById(userId: string): Promise<ApiResponse<User>> {
        return request({
            url: `/api/user/${userId}`,
            method: 'GET',
        });
    },

    /**
 * 用户注册
 */
    async register(userData: RegisterRequest): Promise<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('name', userData.name || '');
        formData.append('email', userData.email);
        formData.append('password', userData.password);

        return request({
            url: '/api/user',
            method: 'PUT',
            data: formData,
            extra: 'importFile',
        });
    },

    /**
     * 用户登录
     */
    async login(loginData: LoginRequest): Promise<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('email', loginData.email);
        formData.append('password', loginData.password);

        return request({
            url: '/api/user',
            method: 'POST',
            data: formData,
            extra: 'importFile',
        });
    },

    /**
     * 更新用户信息
     */
    async update(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<any>> {
        const formData = new FormData();
        if (userData.email) formData.append('email', userData.email);
        if (userData.name) formData.append('name', userData.name);

        return request({
            url: `/api/user/${userId}`,
            method: 'PUT',
            data: formData,
            extra: 'importFile',
        });
    },

    /**
     * 删除用户
     */
    async delete(userId: string): Promise<ApiResponse<{ message: string }>> {
        return request({
            url: `/api/user/${userId}`,
            method: 'DELETE',
        });
    },

    /**
     * 获取当前登录用户信息
     */
    async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
        return request({
            url: '/api/user/me',
            method: 'GET',
        });
    },
};
