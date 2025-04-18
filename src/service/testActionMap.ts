/**
 * @处理在内部跨域的请求做无头浏览器的请求
 */

// 定义用户数据的类型

interface Blog {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
}
// 新增：获取用户列表
import request from '../lib/request';

export async function fetchBlogs(): Promise<Blog[]> {
  try {
    const { data } = await request({
      url: '/blogs',
      method: 'GET',
    });
    return data;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
}
