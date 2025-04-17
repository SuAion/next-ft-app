'use client'
import VirtualListNoHeight from "@/components/VirtualListNoHeight"
import { useEffect, useState } from "react"
import Mock from 'mockjs';
interface Blog {
  id: string
  title: string
  author: string
  category: string
  date: string
}
export default function HeightList() {
  const [dataSource, setDataSource] = useState([]);
  const addData = () => {
    const newData = [];
    for (let i = 0; i < 20; i++) {
      const len: number = dataSource.length + newData.length;
      newData.push({
        id: len,
        content: Mock.mock("@csentence(40, 100)"), // 内容
      });
    }
    setDataSource(prevData => {
      const updatedData = [...prevData, ...newData];
      console.log('=======>Updated dataSource', updatedData);
      return updatedData;
    })
  };

  useEffect(() => {
    addData()
  }, [])


  return (
    <div className="space-y-4" style={{ height: '80vh', width: '100%', }}>
      <div className="test-estimated-list-container">
        <VirtualListNoHeight dataSource={dataSource} estimatedHeight={120} getMoreData={addData}>
          {() => ( // 将 children 作为函数传递
            <div data-author style={{ height: 100 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, est officia? Doloremque dolorem odit quibusdam illum vitae atque ipsum. Dolorem amet nulla eveniet repellat voluptatibus autem asperiores inventore non tenetur?
            </div>
          )}
        </VirtualListNoHeight>
      </div>
    </div>
  )
}
