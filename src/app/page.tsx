'use client';

import FTImage from '@/components/FTImage';
import FTScroll from '@/components/FTScroll';
import WaterFull from '@/components/WaterFull';
import { Metadata } from 'next';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';

interface WorkItem {
  id: string;
  imageWidth: number;
  imageHeight: number;
  url: string;
  info: {
    [key: string]: any;
  };
}
// 顶级meta 页面meta与此合并
// export const metadata: Metadata = {
//   title: 'Fotor Visual Creative Community',
//   description:
//     'Explore more AI artworks and boost engagement through AI image creation on Fotor visual creative community.',
// };

export default function Home() {
  const [WaterFullArr, setWaterFullArr] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据

  // 修改数据加载函数
  function loadMockData(num: number): Promise<WorkItem[]> {
    return new Promise((resolve) => {
      let mockData = [];
      const startIndex = (page - 1) * num;
      for (let i = startIndex; i < startIndex + num; i++) {
        const width = Math.floor(Math.random() * 201) + 300;
        const height = Math.floor(Math.random() * 201) + 300;
        const info = {
          id: i,
          imageWidth: width,
          imageHeight: height,
          url: `https://picsum.photos/${width}/${height}?${Math.floor(Math.random() * 201)}`,
          info: {
            bgColor: '#565646',
            title: '标题标题标题标题标题标题标题标题标题',
            author: '作者',
          },
        };
        mockData.push(info);
      }
      setTimeout(() => {
        resolve(mockData);
      }, 2000); // 延迟2秒再返回数据
    });
  }

  // 修改数据获取函数
  async function getData() {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const newData = await loadMockData(30);
      if (newData.length === 0) {
        setHasMore(false);
        return;
      }
      setWaterFullArr((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  // 初始加载
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="public-section-container">
      <p className="fixed top-4 right-4 bg-white px-2 py-1 rounded shadow">{WaterFullArr.length} 个作品</p>
      <FTScroll
        id="scroll"
        className="scroll-container"
        onScrollToBottom={getData}
        loading={loading}
        relativeNeedDropDownData={WaterFullArr}
      >
        <WaterFull columns={2} gap={20} waterFullData={WaterFullArr}>
          {(
            item, // 将 children 作为函数传递
          ) => (
            <div className=" water-templete  flex flex-col gap-4">
              <div
                className="card-box"
                style={
                  {
                    // paddingBottom: (item.imageHeight / item.imageWidth) * 100 + '%', // 计算高度占比,
                  }
                }
              >
                <div className="card_img">
                  <FTImage
                    className="dark:invert"
                    src={item.url}
                    alt="Next.js logo"
                    width={item.imageWidth}
                    height={item.imageHeight}
                    priority
                  />
                </div>
                <div className="card_info" style={{ paddingTop: item.imageHeight }}>
                  <div className="author">
                    <div className="avatar"></div>
                    <div className="author-info">
                      <p className="author-name">{item.info.author}</p>
                      <p className="author-desc">
                        itemLorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, quod.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </WaterFull>
      </FTScroll>
    </div>
  );
}
