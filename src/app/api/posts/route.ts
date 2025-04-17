// app/api/posts/route.ts
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/response';

// GET /api/posts - 获取所有博客
export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return ApiResponse.success(posts);
}

// POST /api/posts - 创建新博客（需要权限）
export async function POST(req: Request) {
  try {
    const user = await verifyToken();
    const body = await req.json();
    console.log('=======>user', user);
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: user.id,
      },
    });
    return ApiResponse.success(post);
  } catch (err) {
    return ApiResponse.error('Unauthorized', '400');
  }
}
