type Params = Record<string, string | string[]>;

// 获取单个用户
// app/api/auth/me/route.ts
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ApiResponse } from '@/lib/response';

const SECRET = process.env.JWT_SECRET || 'secret';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('未登录');

    const decoded = jwt.verify(token, SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });
    if (!user) throw new Error('用户不存在');

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '获取用户信息失败' }, { status: 401 });
  }
}

// 更新用户
export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  try {
    // const body = await request.json()
    // const { email, name } = body
    const resolvedParams = await params; // 等待 params 解析
    const formData = await request.formData(); // 获取 formData
    const email = formData.get('email') as string; // 从 formData 中提取 email
    const name = formData.get('name') as string; // 从 formData 中提取 name

    const user = await prisma.user.update({
      where: {
        id: resolvedParams.id as string,
      },
      data: {
        email,
        name,
      },
    });

    return ApiResponse.success(user);
  } catch (error) {
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const resolvedParams = await params; // 等待 params 解析
    await prisma.user.delete({
      where: {
        id: resolvedParams.id as string,
      },
    });

    return NextResponse.json({ message: '用户删除成功' });
  } catch (error) {
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 });
  }
}
