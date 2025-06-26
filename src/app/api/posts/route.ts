// app/api/posts/route.ts
import { prisma } from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ServerResponse, ErrorCode } from '@/lib/response';
import { z } from 'zod';

// 创建博客的验证模式
const CreatePostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200字符'),
  content: z.string().min(1, '内容不能为空').max(10000, '内容不能超过10000字符'),
});

// GET /api/posts - 获取所有博客
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';

    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 100) {
      return ServerResponse.validationError('无效的分页参数');
    }

    const skip = (page - 1) * limit;

    // 构建搜索条件
    const where = search
      ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }
      : {};

    // 执行数据库查询
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    const response = {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    return ServerResponse.success(response);
  } catch (error) {
    console.error('获取博客列表失败:', error);
    return ServerResponse.databaseError('获取博客列表失败');
  }
}

// POST /api/posts - 创建新博客（需要权限）
export async function POST(req: Request) {
  try {
    // 验证用户身份
    const user = await verifyToken();
    if (!user) {
      return ServerResponse.authenticationError('用户未登录');
    }

    // 解析请求体
    let body;
    try {
      body = await req.json();
    } catch {
      return ServerResponse.validationError('请求体格式错误');
    }

    // 验证输入数据
    const validationResult = CreatePostSchema.safeParse(body);
    if (!validationResult.success) {
      return ServerResponse.validationError(
        '输入数据验证失败',
        validationResult.error.flatten()
      );
    }

    const { title, content } = validationResult.data;

    // 创建博客
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
    });

    console.log(`✅ 博客创建成功: ${post.id} - "${post.title}"`);
    return ServerResponse.success(post, '博客创建成功');
  } catch (error) {
    console.error('创建博客失败:', error);

    // 简化的错误处理
    if (error instanceof Error) {
      // 认证相关错误
      if (error.message.includes('Unauthorized')) {
        return ServerResponse.authenticationError('认证失败');
      }

      // 数据库相关错误
      if (error.message.includes('Prisma') || error.message.includes('connection')) {
        return ServerResponse.databaseError('数据库操作失败');
      }
    }

    return ServerResponse.error('创建博客失败', ErrorCode.INTERNAL_ERROR);
  }
}
