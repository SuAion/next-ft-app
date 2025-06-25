// 博客文章相关类型定义

/**
 * 博客文章基础信息
 */
export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    status?: 'draft' | 'published' | 'archived';
    tags?: string[];
    views?: number;
    likes?: number;
}

/**
 * 创建文章请求
 */
export interface CreatePostRequest {
    title: string;
    content: string;
    status?: 'draft' | 'published';
    tags?: string[];
}

/**
 * 更新文章请求
 */
export interface UpdatePostRequest {
    title?: string;
    content?: string;
    status?: 'draft' | 'published' | 'archived';
    tags?: string[];
}

/**
 * 文章查询参数
 */
export interface PostQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'draft' | 'published' | 'archived';
    authorId?: string;
    tags?: string[];
    sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'views';
    sortOrder?: 'asc' | 'desc';
}

/**
 * 文章详情（包含作者信息）
 */
export interface PostDetail extends Post {
    author: {
        id: string;
        name?: string;
        email: string;
    };
}

/**
 * 文章统计信息
 */
export interface PostStats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalLikes: number;
}
