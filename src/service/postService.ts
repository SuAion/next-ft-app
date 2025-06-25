// 文章服务 - 重构后的标准化实现
import request from '@/lib/request';
import {
    Post,
    CreatePostRequest,
    UpdatePostRequest,
    PostQueryParams,
    ApiResponse
} from '@/types';

/**
 * 文章服务 - 对比当前的 ActionMap 方式
 */
export const postService = {
    /**
     * 获取所有文章 - 统一错误处理和类型
     */
    async getAll(): Promise<ApiResponse<Post[]>> {
        return request({
            url: '/api/posts',
            method: 'GET',
        });
    },

    /**
     * 根据ID获取文章 - 统一的响应格式
     */
    async getById(id: string): Promise<ApiResponse<Post>> {
        return request({
            url: `/api/posts/${id}`,
            method: 'GET',
        });
    },

    /**
 * 创建文章 - 标准化的请求处理
 */
    async create(data: CreatePostRequest): Promise<ApiResponse<any>> {
        return request({
            url: '/api/posts',
            method: 'POST',
            data,
            extra: 'JSON',
        });
    },

    /**
     * 更新文章 - 统一的参数和返回类型
     */
    async update(id: string, data: UpdatePostRequest): Promise<ApiResponse<any>> {
        return request({
            url: `/api/posts/${id}`,
            method: 'PUT',
            data,
            extra: 'JSON',
        });
    },

    /**
     * 删除文章 - 统一的删除处理
     */
    async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
        return request({
            url: `/api/posts/${id}`,
            method: 'DELETE',
        });
    }
};
