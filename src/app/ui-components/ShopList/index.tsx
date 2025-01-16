'use client'
import { fetchBlogs } from "@/app/actions/TestActionMap"
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
    <div className="p-4" style={{ height: '100vh', width: '100%' }}>
      <h2 className="text-xl font-bold mb-4">测试列表</h2>
      <div className="space-y-4">
        <VirtualList virtualData={blogs} columns={3} gap={16} dataHeight={200}>
          {(item) => ( // 将 children 作为函数传递
            <div className=" water-templete  flex flex-col gap-4">
              <div className="avatar">
              </div>
              <div className="author-info">
                {/* <p className="author-name">{item.content}</p> */}
                <p className="author-desc">
                  itemLorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nobis, quod.
                </p>
              </div>
            </div>
          )}
        </VirtualList>
      </div>
    </div>
  );
}
