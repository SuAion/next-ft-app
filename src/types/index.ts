// 类型定义统一导出
// 这个文件作为所有类型定义的入口点

// API 相关类型
export * from './api';

// 认证相关类型
export * from './auth';

// 用户相关类型
export * from './user';

// 博客文章相关类型
export * from './post';

// 通用类型
export * from './common';

// 重新导出常用类型（为了方便使用）
export type {
    ApiResponse,
    PaginationParams,
    PaginatedResponse
} from './api';

export type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    UserProfile
} from './user';

export type {
    Post,
    PostDetail,
    CreatePostRequest,
    UpdatePostRequest
} from './post';

export type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    JWTPayload
} from './auth';

export type {
    ID,
    Timestamp,
    Status,
    Theme,
    Language,
    BaseEntity,
    Notification,
    MenuItem
} from './common';