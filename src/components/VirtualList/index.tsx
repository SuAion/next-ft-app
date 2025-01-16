'use client'
import { useRef, useEffect, useState } from "react";
import styles from './index.module.scss';
import clsx from 'clsx';
import { rafThrottle } from "@/utils";

interface Blog {
  id: string
  title: string
  author: string
  category: string
  date: string
}

interface VirtualProps {
  children: (props: ChildProps) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  columns: number;
  gap: number;
  virtualData: Blog[]
  dataHeight: number;
}

interface ChildProps {
  id: string;
  columnWidth: number;
  imageHeight: number;
  imageWidth: number;
  url: string;
  info: {
    [key: string]: any;
  }
}

export const VirtualList = ({ children, virtualData, gap, dataHeight }: VirtualProps) => {
  console.log('=======>virtualData', virtualData)
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliceRenderList, setSliceRenderList] = useState([]);

  const [position, setPosition] = useState({
    startIndex: 0,
    endIndex: 10
  });

  /** @计算容器高度可以最多放下多少个item **/
  const getMaxRenderNum = () => {
    return (containerRef.current?.offsetHeight / dataHeight) || 0;
  };

  /**
   * @计算上游标
   * @上游标会随着滚动而改变
   * **/
  const handleScroll = rafThrottle(() => {
    const { scrollTop } = containerRef.current!;
    /** @下游标始终等于上游标加上显示的个数 **/
    const startIndex = Math.floor(scrollTop / dataHeight)
    const endIndex = startIndex + getMaxRenderNum();
    setPosition({
      startIndex: startIndex,
      endIndex: endIndex
    });
  });

  /**
   *  @计算要渲染的列表
   * @列表是取出上游标和下游标之间的数据
   *  **/
  const getSliceRenderList = () => {
    const { startIndex, endIndex } = position;
    const sliceList = virtualData.slice(startIndex, endIndex);
    console.log('=======>sliceList', sliceList)
    setSliceRenderList([...sliceRenderList, ...sliceList,]);
  };



  useEffect(() => {
    containerRef.current?.addEventListener('scroll', handleScroll);
    console.log('=======>virtualData111', virtualData)
    getSliceRenderList()
    console.log('=======>getMaxRenderNum()', getMaxRenderNum())
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    getSliceRenderList()
  }, [virtualData]);




  return (
    <div className={clsx(styles['work-list-container'], 'water-container', 'flex')} ref={containerRef} style={{ gap }}>
      {sliceRenderList.length}
      {sliceRenderList.map((item) => (
        <div key={item.id} data-id={item.id} className="water-item mb-2">
          {children(item)}
        </div>
      ))}
    </div>
  );
};
