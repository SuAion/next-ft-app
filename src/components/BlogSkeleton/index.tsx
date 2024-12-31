export default function BlogSkeleton() {
  return (
    <div className="p-4">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="border p-4 rounded-lg shadow mb-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}