// app/api/posts/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { ApiResponse } from '@/lib/response';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });
  return ApiResponse.success(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const userInfo = verifyToken();
    console.log('=======>userInfo', userInfo);
    const body = await req.json();
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        authorId: body.authorId,
        title: body.title,
        content: body.content,
      },
    });
    return ApiResponse.success(post);
  } catch {
    return ApiResponse.error('Unauthorized', '400');
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    verifyToken();
    await prisma.post.delete({
      where: { id: params.id },
    });
    return ApiResponse.success({ success: true });
  } catch {
    return ApiResponse.error('Unauthorized', '400');
  }
}
