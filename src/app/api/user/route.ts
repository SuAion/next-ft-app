import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { SignupFormSchema, LoginFormSchema } from '@/validators/userValidator';
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
import { cookies } from 'next/headers'
import { signToken } from '@/lib/auth';
const SECRET = process.env.JWT_SECRET || 'secret'
/** @获取所有用户 **/
export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
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
      return NextResponse.json({ error: '请输入邮箱和密码' }, { status: 400 });
    }
    // 使用 LoginFormSchema 验证输入格式
    const validatedFields = SignupFormSchema.safeParse({
      email,
      password,
      name,
    });

    if (!validatedFields.success) {
      return NextResponse.json({
        success: false,
        errors: validatedFields.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) return NextResponse.json({ error: '该邮箱已注册' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isAdmin: false,
      },
    });

    return NextResponse.json({ message: '注册成功', userId: user.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '注册失败' }, { status: 500 });
  }
}

/** @登录用户 **/
export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const email = data.get('email')?.toString();;
    const password = data.get('password')?.toString();;

    // 验证输入格式
    const validatedFields = LoginFormSchema.safeParse({
      email,
      password,
    });
    if (!email || !password) return NextResponse.json({ error: '请输入邮箱和密码' }, { status: 200 })

    if (!validatedFields.success) {
      return NextResponse.json({
        success: false,
        errors: validatedFields.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email } })
    if (!user) return NextResponse.json({ error: '用户不存在' }, { status: 200 })
    // 验证密码
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: '密码错误' }, { status: 200 })

    // 生成 token
    const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin }, '7d')

    // 更新数据库中 token 和过期时间
    await prisma.user.update({
      where: { id: user.id },
      data: {
        token,
        tokenExp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    })

    // 设置 cookie
    const response = NextResponse.json({
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
    })

    response.headers.set('Authorization', `Bearer ${token}`)

    return response
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '登录失败' }, { status: 400 })
  }
}

