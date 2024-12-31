import ClientSideCp from "@/components/ClientSideCp";

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

export default  function Home({ searchParams }: { searchParams: SearchParams }) {
  console.log('home_searchParams', searchParams);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ClientSideCp/>
    </div>
  );
}
