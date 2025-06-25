// 用户相关类型定义

/**
 * 用户基础信息
 */
export interface User {
    id: string;
    email: string;
    name?: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    tokenExp?: string;
}

/**
 * 创建用户请求
 */
export interface CreateUserRequest {
    email: string;
    name?: string;
    password: string;
    isAdmin?: boolean;
}

/**
 * 更新用户请求
 */
export interface UpdateUserRequest {
    email?: string;
    name?: string;
    password?: string;
    isAdmin?: boolean;
}

/**
 * 用户查询参数
 */
export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    isAdmin?: boolean;
    sortBy?: 'name' | 'email' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

/**
 * 用户个人资料
 */
export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    createdAt: string;
}

/**
 * 用户设置
 */
export interface UserSettings {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'private';
        showEmail: boolean;
    };
}

/**
 * 用户统计信息
 */
export interface UserStats {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    joinedDate: string;
    lastActivity: string;
}