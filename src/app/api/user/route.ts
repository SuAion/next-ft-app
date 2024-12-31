
import { prisma } from 'app/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有用户
export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: '获取用户失败' }, { status: 500 })
  }
}

// 创建用户
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password, // 注意：实际应用中应该对密码进行加密
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: '创建用户失败' }, { status: 500 })
  }
}