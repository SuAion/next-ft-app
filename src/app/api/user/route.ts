import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { SignupFormSchema, RegisFormSchema } from '@/validators/userValidator';
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
import { cookies } from 'next/headers'

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
export async function PUT(request) {
  // formData
  const data = await request.formData(); // 从请求中获取数据

  const validatedFields = RegisFormSchema.safeParse({
    name: data.get('name'), // 使用从请求中获取的数据
    email: data.get('email'),
    password: data.get('password'),
  });

  if (!validatedFields.success) {
    return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors, }, { status: 200 }); // 返回验证错误
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 进行数据库操作，例如创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // 存储加密后的密码
      },
    });

    return NextResponse.json(user, { status: 201 }); // 返回创建的用户
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ errors: error.errors }, { status: 400 }); // 返回验证错误
    }
    console.error('注册失败:', error);
    return NextResponse.json({ message: '注册失败' }, { status: 500 }); // 返回服务器错误
  }
}


/** @登录用户 **/
export async function POST(request) {
  try {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    // 验证输入格式
    const validatedFields = SignupFormSchema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      return NextResponse.json({
        success: false,
        errors: validatedFields.error.flatten().fieldErrors
      }, { status: 400 });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`用户不存在: ${email}`);
      return NextResponse.json({
        success: false,
        error: '用户不存在'
      }, { status: 404 });
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      console.log(`密码错误: ${email}`);
      return NextResponse.json({
        success: false,
        error: '密码错误'
      }, { status: 400 });
    }

    console.log(`用户登录成功: ${email}`);

    // 生成JWT token
    const tokenExp = new Date(Date.now() + 10 * 60 * 1000); // 10分钟后过期
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        exp: Math.floor(tokenExp.getTime() / 1000)
      },
      process.env.JWT_SECRET
    );

    // 更新用户token过期时间
    await prisma.user.update({
      where: { id: user.id },
      data: {
        token
      }
    });

    const cookieStore = await cookies()
    cookieStore.set('token', `${token}`)

    // 设置cookies 过期
    // (await cookies()).set('name', 'value', { maxAge: 0 })

    return NextResponse.json({
      success: true,
      code: 200,
      message: '登录成功',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({
      success: false,
      error: '登录失败',
      code: 500,
    }, { status: 500 });
  }
}

async function verifyPassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}
