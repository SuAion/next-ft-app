// 通用类型定义

/**
 * 通用的 ID 类型
 */
export type ID = string | number;

/**
 * 时间戳类型
 */
export type Timestamp = string | Date;

/**
 * 状态类型
 */
export type Status = 'active' | 'inactive' | 'pending' | 'disabled';

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP' | 'ko-KR';

/**
 * 基础实体接口
 */
export interface BaseEntity {
    id: ID;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * 软删除实体接口
 */
export interface SoftDeleteEntity extends BaseEntity {
    deletedAt?: Timestamp;
    isDeleted?: boolean;
}

/**
 * 可选字段工具类型
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 必选字段工具类型
 */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * 深度部分可选类型
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 通用选项类型
 */
export interface Option<T = any> {
    label: string;
    value: T;
    disabled?: boolean;
    icon?: string;
}

/**
 * 通用键值对类型
 */
export interface KeyValue<T = any> {
    [key: string]: T;
}

/**
 * 文件上传类型
 */
export interface FileUpload {
    file: File;
    progress?: number;
    status?: 'pending' | 'uploading' | 'success' | 'error';
    url?: string;
    error?: string;
}

/**
 * 通知类型
 */
export interface Notification {
    id: ID;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    duration?: number;
    closable?: boolean;
    timestamp: Timestamp;
}

/**
 * 菜单项类型
 */
export interface MenuItem {
    id: ID;
    label: string;
    icon?: string;
    path?: string;
    children?: MenuItem[];
    disabled?: boolean;
    hidden?: boolean;
    permission?: string;
}