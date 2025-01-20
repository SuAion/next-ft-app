'use client'
import { useRef, useEffect, useState } from "react";
import styles from './index.module.scss';
import clsx from 'clsx';
import { rafThrottle } from "@/utils";

interface Blog {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
}

interface VirtualProps {
  children: (props: ChildProps) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  columns: number;
  gap: number;
  virtualData: Blog[];
  dataHeight: number;
}

interface ChildProps {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
}

export const VirtualList = ({ children, virtualData, gap, dataHeight }: VirtualProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliceRenderList, setSliceRenderList] = useState<Blog[]>([]);
  const [position, setPosition] = useState({ startIndex: 0, endIndex: 0 });

  // 计算容器高度可以最多放下多少个item
  const getMaxRenderNum = () => {
    return Math.ceil((containerRef.current?.offsetHeight || 0) / dataHeight);
  };

  // 处理滚动事件，计算起始和结束索引
  const handleScroll = rafThrottle(() => {
    if (!containerRef.current) return;
    const { scrollTop } = containerRef.current;
    const startIndex = Math.floor(scrollTop / dataHeight);
    const endIndex = Math.min(startIndex + getMaxRenderNum(), virtualData.length);
    setPosition({ startIndex, endIndex });
  });

  // 更新要渲染的列表数据
  useEffect(() => {
    if (!containerRef.current) return;
    // 初始化时加载列表
    handleScroll();

    // 添加滚动事件监听
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [virtualData]);

  // 根据position更新sliceRenderList
  useEffect(() => {
    const sliceList = virtualData.slice(position.startIndex, position.endIndex);
    setSliceRenderList(sliceList);
  }, [position, virtualData]);

  return (
    <div className={styles['water-content']} ref={containerRef}>
      <div
        className={styles['water-list']}
        style={{
          gap,
          height: `${dataHeight * (virtualData.length - position.startIndex)}px`,
          transform: `translate3d(0, ${dataHeight * position.startIndex}px, 0)`,
        }}
      >
        {sliceRenderList.map((item) => (
          <div key={item.id} className="water-item mb-2">
            {children(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
