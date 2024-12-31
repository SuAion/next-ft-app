import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.vercel.app/blog')
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '获取博客失败' }, { status: 500 })
  }
}