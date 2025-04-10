import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
type Params = Record<string, string | string[]>

// 获取单个用户
export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params; // 等待 params 解析
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: resolvedParams.id as string,
      },
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: '获取用户失败' }, { status: 500 })
  }
}

// 更新用户
export async function PUT(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    // const body = await request.json()
    // const { email, name } = body
    const resolvedParams = await params; // 等待 params 解析
    const formData = await request.formData() // 获取 formData
    const email = formData.get('email') as string // 从 formData 中提取 email
    const name = formData.get('name') as string // 从 formData 中提取 name


    const user = await prisma.user.update({
      where: {
        id: resolvedParams.id as string,
      },
      data: {
        email,
        name,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 })
  }
}

// 删除用户
export async function DELETE(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const resolvedParams = await params; // 等待 params 解析
    await prisma.user.delete({
      where: {
        id: resolvedParams.id as string,
      },
    })

    return NextResponse.json({ message: '用户删除成功' })
  } catch (error) {
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 })
  }
}
