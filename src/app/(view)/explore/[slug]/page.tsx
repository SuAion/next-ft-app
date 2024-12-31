

// 方式一

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const slug = (await params).slug
//   console.log(slug)

//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <h1>Explore{slug}</h1>
//     </div>
//   );
// }



// 方式二
'use client'
import { use } from 'react'
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = use(params)
  const a = use(searchParams)
  //http://localhost:3000/explore/2?id=456&category=electronics
  console.log(a)

    return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Explore{slug}</h1>
    </div>
  );
}