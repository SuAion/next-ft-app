// app/api/posts/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { ServerResponse } from '@/lib/response';
type Params = Record<string, string | string[]>;
export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  const resolvedParams = await params; // 等待 params 解析
  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id as string },
  });
  return ServerResponse.success(post);
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  const resolvedParams = await params; // 等待 params 解析
  try {
    const userInfo = verifyToken();
    console.log('=======>userInfo', userInfo);
    const body = await request.json();
    const post = await prisma.post.update({
      where: { id: resolvedParams.id as string },
      data: {
        authorId: body.authorId,
        title: body.title,
        content: body.content,
      },
    });
    return ServerResponse.success(post);
  } catch {
    return ServerResponse.error('Unauthorized');
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
  const resolvedParams = await params; // 等待 params 解析
  try {
    verifyToken();
    await prisma.post.delete({
      where: { id: resolvedParams.id as string },
    });
    return ServerResponse.success({ success: true });
  } catch {
    return ServerResponse.error('Unauthorized');
  }
}
