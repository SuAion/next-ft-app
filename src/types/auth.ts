// 认证相关类型定义

/**
 * JWT Token 负载
 */
export interface JWTPayload {
    id: string;
    email: string;
    isAdmin: boolean;
    exp: number;
    iat: number;
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * 注册请求参数
 */
export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}

/**
 * 认证响应数据
 */
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name?: string;
        isAdmin: boolean;
    };
    token?: string;
}

/**
 * 用户会话信息
 */
export interface UserSession {
    id: string;
    email: string;
    name?: string;
    isAdmin: boolean;
    tokenExp?: string;
}

/**
 * 权限角色
 */
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

/**
 * 权限验证结果
 */
export interface AuthVerification {
    isValid: boolean;
    user?: UserSession;
    error?: string;
}