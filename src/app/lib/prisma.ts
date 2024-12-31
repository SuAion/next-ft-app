import { PrismaClient } from '@prisma/client'

// 为 global 对象添加类型定义
// 这是为了解决在开发环境下 Hot Reload 导致创建多个 PrismaClient 实例的问题
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// 创建 PrismaClient 实例
// 如果已经存在实例，则复用现有实例
// 如果不存在，则创建新实例
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // 启用查询日志，方便调试
  })

// 在开发环境中保存 PrismaClient 实例到全局对象
// 这样可以在开发时避免创建过多的数据库连接
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma