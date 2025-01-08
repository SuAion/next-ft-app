import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma';
import { SignupFormSchema, FormState } from '@/prisma/validators/userValidator';
// import { FotorMongoDB } from '@/database/connect/mongodb'

const prismaClient = new PrismaClient();

/** @获取所有用户 **/
export async function GET() {

  try {
    console.log('=======>接口',)
    const users = await prismaClient.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}




/** @创建用户 **/
export async function POST(request) {

  // formData
  const data = await request.formData(); // 从请求中获取数据
  console.log('=======>', data.get('name'))

  const validatedFields = SignupFormSchema.safeParse({
    name: data.get('name'), // 使用从请求中获取的数据
    email: data.get('email'),
    password: data.get('password'),
  });

  // const data = await request.json(); // 从请求中获取数据
  // const validatedFields = SignupFormSchema.safeParse({
  //   name: data.name, // 使用从请求中获取的数据
  //   email: data.email,
  //   password: data.password,
  // });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors, }, { status: 200 }); // 返回验证错误
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 进行数据库操作，例如创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // 确保密码经过加密处理
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

