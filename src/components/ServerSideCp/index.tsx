
interface Post  {
  id: string
  title: string
}

export default async function ServerSideCp() {
  try {
    const response = await fetch('https://api.vercel.app/blog');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const posts = await response.json();
    return (
      <ul>
        {posts.map((post: Post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return <div>Failed to load posts.</div>;
  }
}
