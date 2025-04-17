import { ServerResponse } from '@/lib/response';

export async function GET() {
  try {
    const res = await fetch('https://api.pixbe.com/api/activity/banner?page=1&pageSize=12&platform=4');
    const data = await res.json();
    return ServerResponse.success(data);
  } catch (error) {
    return ServerResponse.error('获取博客失败');
  }
}
