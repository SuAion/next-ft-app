
interface Post {
  id: string
  title: string
}
import { baseStore } from "@/store/baseStore";

export default async function ServerSideCp() {
  const { setPosts, posts: standPost, count, setCount } = baseStore.getState(); // 直接获取 setPosts 方法


  try {
    const response = await fetch('https://api.vercel.app/blog');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blogs = await response.json();
    setPosts(blogs)
    //


    /**
    * @运行态的时候设置count为20但是不会同步到zustand
    * @状态管理是基于客户端的一一一因此在服务端组件中调用状态更新方法不会影响客户端的状态
    */
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
