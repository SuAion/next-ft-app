'use client'
import { WaterFull } from "@/components/WaterFull";
import { Metadata } from "next";
import Image from "next/image";
import { use, useEffect, useState } from "react";


interface WorkItem {
  id: string;
  imageWidth: number;
  imageHeight: number;
  url: string;
  info: {
    [key: string]: any;
  }
}
// 顶级meta 页面meta与此合并
// export const metadata: Metadata = {
//   title: 'Fotor Visual Creative Community',
//   description:
//     'Explore more AI artworks and boost engagement through AI image creation on Fotor visual creative community.',
// };


export default function Home() {

  const [WaterFullArr, setWaterFullArr] = useState<WorkItem[]>([]);

  function loadMockData(num: number): Promise<WorkItem[]> {
    // 生成模拟数据
    return new Promise((resolve, reject) => {
      let mockData = [];
      for (let i = 0; i < num; i++) {
        const id = `work_id_${i}`;
        const width = Math.floor(Math.random() * 201) + 300; // 300 到 500 之间的随机数
        const height = Math.floor(Math.random() * 201) + 300; // 300 到 500 之间的随机数
        const info = {
          id: i,
          imageWidth: width,
          imageHeight: height,
          url: `https://picsum.photos/${width}/${height}?${Math.floor(Math.random() * 201)}`,
          info: {
            bgColor: "#565646",
            title: "标题标题标题标题标题标题标题标题标题",
            author: "作者",
          }
        };
        mockData.push(info);
      }
      resolve(mockData);
    });
  }
  useEffect(() => {
    loadMockData(10).then((data) => {
      setWaterFullArr(data);
    });
  }, []);


  return (
    <div className="public-section-container">
      <WaterFull columns={2} gap={20} waterFullData={WaterFullArr}>
        {(item) => ( // 将 children 作为函数传递
          <div className=" water-templete  flex flex-col gap-4">
            <div className="card-box">
              <div className="card_img">
                <Image
                  className="dark:invert"
                  src={item.url}
                  alt="Next.js logo"
                  width={item.imageWidth}
                  height={item.imageHeight}
                  priority
                />
              </div>
              <div className="card_info" style={{ paddingTop: item.imageHeight }}>
                <p className="title">{item.info.title}</p>
                <div className="author">
                  <div className="avatar">
                  </div>
                  <div className="author-info">
                    <p className="author-name">{item.info.author}</p>
                    <p className="author-desc">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Nobis, quod.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </WaterFull>
    </div>
  );
}
