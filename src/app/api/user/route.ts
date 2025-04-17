import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignupFormSchema, LoginFormSchema } from '@/validators/userValidator';
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
import { cookies } from 'next/headers';
import { signToken } from '@/lib/auth';
import { ServerResponse } from '@/lib/response';
const SECRET = process.env.JWT_SECRET || 'secret';
/** @获取所有用户 **/
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return ServerResponse.success(users);
  } catch (error) {
    return ServerResponse.error(error);
  }
}
/** @注册用户 **/
export async function PUT(req: Request) {
  try {
    const data = await req.formData();
    const name = data.get('name')?.toString();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    // 验证输入是否存在
    if (!email || !password) {
      return ServerResponse.error('请输入邮箱和密码');
    }
    // 使用 LoginFormSchema 验证输入格式
    const validatedFields = SignupFormSchema.safeParse({
      email,
      password,
      name,
    });

    if (!validatedFields.success) {
      return ServerResponse.error('请输入正确的邮箱和密码');
    }

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) return ServerResponse.error('该邮箱已注册');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isAdmin: false,
      },
    });

    return ServerResponse.success({ message: '注册成功', userId: user.id });
  } catch (err: any) {
    return ServerResponse.error(err.message || '注册失败');
  }
}

/** @登录用户 **/
export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    // 验证输入格式
    const validatedFields = LoginFormSchema.safeParse({
      email,
      password,
    });
    if (!email || !password) return ServerResponse.error('请输入邮箱和密码');

    if (!validatedFields.success) {
      ServerResponse.error('请输入正确的邮箱和密码');
    }

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return ServerResponse.error('用户不存在');
    // 验证密码
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return ServerResponse.error('密码错误');

    // 生成 token
    const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin }, '7d');

    // 更新数据库中 token 和过期时间
    await prisma.user.update({
      where: { id: user.id },
      data: {
        token,
        tokenExp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    // 设置 cookie
    const response = ServerResponse.success({
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name,
      },
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    response.headers.set('Authorization', `Bearer ${token}`);

    return response;
  } catch (err: any) {
    return ServerResponse.error(err.message || '登录失败');
  }
}
