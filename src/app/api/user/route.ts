import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { SignupFormSchema, RegisFormSchema } from '@/validators/userValidator';
import bcrypt from 'bcrypt';


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
export async function POST(request) {
  // formData
  const data = await request.formData(); // 从请求中获取数据
  console.log('=======>', data.get('name'))

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
export async function PUT(request) {
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
      }, { status: 401 });
    }

    console.log(`用户登录成功: ${email}`);
    return NextResponse.json({
      success: true,
      code: 200,
      message: '登录成功',
      data: user
    }, { status: 200 });

  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json({
      success: false,
      error: '登录失败',
      code: 500,
      message: '登录成功',
    }, { status: 500 });
  }
}

async function verifyPassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}
