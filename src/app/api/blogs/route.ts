import { ServerResponse } from '@/lib/response';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '12';

    const res = await fetch(`https://api.pixbe.com/api/activity/banner?page=${page}&pageSize=${pageSize}&platform=4`);
    const data = await res.json(); // 修复：添加 await
    return ServerResponse.success(data);
  } catch (error) {
    return ServerResponse.error('获取博客失败');
  }
}
