import { PrismaClient } from '@prisma/client';

/**
 * 数据库管理器 - 简化版本
 * 提供单例模式的数据库连接和基础健康检查
 */
class DatabaseManager {
    private static instance: PrismaClient;

    /**
     * 获取数据库实例（单例模式）
     * @returns PrismaClient 实例
     */
    static getInstance(): PrismaClient {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new PrismaClient({
                // 根据环境设置日志级别
                log: process.env.NODE_ENV === 'development'
                    ? ['query', 'error', 'warn']
                    : ['error'],
                // 生产环境优化
                ...(process.env.NODE_ENV === 'production' && {
                    errorFormat: 'minimal',
                }),
            });
        }
        return DatabaseManager.instance;
    }

    /**
     * 健康检查 - 用于 API 路由
     * @returns Promise<boolean>
     */
    static async isHealthy(): Promise<boolean> {
        try {
            // 使用简单的连接测试
            await DatabaseManager.getInstance().$connect();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 断开连接 - 主要用于测试和清理
     */
    static async disconnect(): Promise<void> {
        if (DatabaseManager.instance) {
            await DatabaseManager.instance.$disconnect();
        }
    }
}

// 导出数据库实例（主要使用这个）
export const prisma = DatabaseManager.getInstance();

// 导出健康检查方法（用于 health API）
export const checkDatabaseHealth = DatabaseManager.isHealthy;

// 导出管理器（很少直接使用）
export default DatabaseManager;

// 进程退出时清理连接
if (typeof process !== 'undefined') {
    process.on('beforeExit', async () => {
        await DatabaseManager.disconnect();
    });
}