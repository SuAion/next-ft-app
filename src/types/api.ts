// API 响应相关类型定义
import { ErrorCode } from '@/lib/response';

/**
 * 统一的 API 响应格式
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    headers?: Record<string, string>; // 添加 headers 支持
    error?: {
        code: ErrorCode;
        message: string;
        details?: any;
    };
    timestamp: string;
}

/**
 * 分页参数
 */
export interface PaginationParams {
    page: number;
    limit: number;
    search?: string;
}

/**
 * 分页响应数据
 */
export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

/**
 * API 请求配置
 */
export interface RequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
}

/**
 * 排序参数
 */
export interface SortParams {
    field: string;
    order: 'asc' | 'desc';
}

/**
 * 筛选参数
 */
export interface FilterParams {
    [key: string]: any;
}