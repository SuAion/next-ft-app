import BlogSkeleton from "@/components/BlogSkeleton";
import ClientSideCp from "@/components/ClientSideCp";
import CountList from "@/components/CountList";
import ServerSideCp from "@/components/ServerSideCp";
import { Suspense } from "react";


export const dynamic = 'force-dynamic';
type SearchParams = {
  [key: string]: string | string[] | undefined;
};

// todo 添加动态meta
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const { id } = searchParams;
  console.log(id);

  try {
    // const nickName = await mongoManager.selectNicknameWithUid(id);
    const nickName = '异步获取的值';
    return {
      title: `The profile of ${nickName} in Fotor Visual Creative Community`,
      description: `Discover all the artworks created by ${nickName}`,
      openGraph: {
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_ENV === 'production'
              ? 'https://u-static.fotor.com'
              : 'https://test-u-static.fotor.com'
              }/share/user/${id}.jpg`,
          },
        ],
        url: `${process.env.NEXT_PUBLIC_COMMUNITY_DOMAIN}/p/${id}`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'The creator in Fotor Visual Creative Community',
      description: 'Discover all beautiful artworks created by the creator.',
      robots: { index: false, follow: false },
    };
  }
}

export default async function Home() {
  const response = await fetch('https://api.vercel.app/blog');
  const blogs = await response.json();

  return (
    <div>
      <ClientSideCp initialPosts={blogs} />
      <ServerSideCp />
    </div>
  );
}
