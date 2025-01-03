
import { Suspense } from "react"
import BlogSkeleton from "@/components/BlogSkeleton"
import BlogList from '@/components/BlogList'
import ClientSideCp from "@/components/ClientSideCp"
import I18nWrapper from "@/HOC/I18nWrapper"



// TODO: 服务器组件可以包含客户端组件，适合在服务器端获取数据并传递给客户端进行交互。
export default function Mine() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold p-4">我的博客页面</h1>

      <Suspense fallback={<BlogSkeleton />}>
        <BlogList />
      </Suspense>

      <div className="p-4 mt-4 border-t">
        <h2 className="text-xl font-bold mb-4">客户端内容</h2>
        <I18nWrapper>
          <ClientSideCp initialPosts={[]} />
        </I18nWrapper>
      </div>
    </div>
  )
}