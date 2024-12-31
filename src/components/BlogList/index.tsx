
interface Blog {
  id: string
  title: string
  author: string
  category: string
  date: string
}
export default async function List() {
  let blogs: Blog[] = [];

  try {

    const res = await fetch('https://api.vercel.app/blog')
    blogs = await res.json();
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">博客列表</h2>
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
}
