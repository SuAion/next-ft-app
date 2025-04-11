'use client'
import { fetchBlogs } from "@/actions/TestActionMap"
import { VirtualList } from "@/components/VirtualList"
import { useEffect, useState } from "react"

interface Blog {
  id: string
  title: string
  author: string
  category: string
  date: string
}
export default function ShopList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const getData = async () => {
    const data = await fetchBlogs()
    setBlogs([...blogs, ...data])
  };

  useEffect(() => {
    getData()
  }, [])


  return (
    <div className="space-y-4" style={{ height: '80vh', width: '100%', }}>
      <VirtualList virtualData={blogs} columns={3} gap={16} dataHeight={100} style={{ width: '100%' }}>
        {(item) => ( // 将 children 作为函数传递
          <div data-author={item.author} className="gap-4" style={{ height: 100 }}>
            <p className="author-name">{item.date}</p>
            <p>{item.title}</p>
          </div>
        )}
      </VirtualList>
    </div>
  );
}
