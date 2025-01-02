
interface Post {
  id: string
  title: string
}
import { baseStore } from "@/store/baseStore";
import { useGlobalStore } from "@/store/globalStore";

export default async function ServerSideCp() {
  const { setPosts, posts: standPost, count, setCount } = baseStore.getState(); // 直接获取 setPosts 方法
  console.log('服务到拿到的', count)


  try {
    const response = await fetch('https://api.vercel.app/blog');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blogs = await response.json();
    setPosts(blogs)
    // 运行态的时候 设置 count 为20  但是不会同步到zustand
    // Zustand 的状态管理是基于客户端的，因此在服务端组件中调用状态更新方法不会影响客户端的状态。
    setCount(20)

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">博客列表{count}----</h2>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-600 text-sm">作者: {blog.author}</p>
              <p className="text-gray-500 text-sm">分类: {blog.category}</p>
              <p className="text-gray-500 text-sm">发布日期: {blog.date}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return <div>Failed to load posts.</div>;
  }
}
