
interface Blog {
  id: string
  title: string
  author: string
  category: string
  date: string
}
export default async function BlogList() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5秒超时

    const response = await fetch('https://api.vercel.app/blog', {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const blogs = await response.json();
    return (
      <div>
        {/* 渲染博客列表 */}
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return <div>无法加载博客列表，请稍后重试</div>;
  }
}