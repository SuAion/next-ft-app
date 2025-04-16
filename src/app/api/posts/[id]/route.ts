// app/api/posts/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  })
  return NextResponse.json(post)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const userInfo = verifyToken()
    console.log('=======>userInfo', userInfo)
    const body = await req.json()
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        authorId: body.authorId,
        title: body.title,
        content: body.content,
      },
    })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    verifyToken()
    await prisma.post.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
