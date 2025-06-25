import ClientSideCp from '../ClientSideCp/index';

export default async function ServerSideCp() {
  try {
    const response = await fetch('https://api.vercel.app/blog');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blogs = await response.json();

    return (
      <div className="p-4">
        <ClientSideCp initialPosts={blogs} />
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
  } catch (error) {
    console.error('Error fetching posts:', error);
    return <div>Failed to load posts.</div>;
  }
}