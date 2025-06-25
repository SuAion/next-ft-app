/**
 * @returns WaterFull
 * @description WaterFull
 */

import { useRef } from 'react';
import styles from './index.module.scss';
import clsx from 'clsx'; // 确保导入 clsx

interface WorkItem {
  id: string;
  imageWidth: number;
  imageHeight: number;
  url: string;
  info: {
    [key: string]: any;
  };
}

interface ChildProps {
  columnWidth: number;
  imageHeight: number;
  imageWidth: number;
  url: string;
  info: {
    [key: string]: any;
  };
}

interface WaterFullProps {
  children: (item: ChildProps) => React.ReactNode; // 修改这里，明确指定 children 的类型
  className?: string;
  style?: React.CSSProperties;
  columns: number;
  gap: number;
  waterFullData: WorkItem[];
}

const WaterFull: React.FC<WaterFullProps> = ({ children, columns, waterFullData, gap }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  /** @列宽计算 **/
  const getColumnWidth = () => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    return Math.floor((containerWidth - gap * (columns - 1)) / columns);
  };

  const columnWidth = getColumnWidth();

  /** @根据columns构造初始数据 **/
  const columnsArr = Array.from({ length: columns }, (_, i) => {
    return {
      index: i,
      columnHeight: 0,
      dataList: [],
    };
  });

  /** @找到最短的列 **/
  const minHeightColumn = () => {
    return columnsArr.reduce((prev, curr) => {
      return prev.columnHeight < curr.columnHeight ? prev : curr;
    });
  };

  /** @根据高度处理数据 **/
  function handleData(data: WorkItem[]) {
    waterFullData.forEach((item) => {
      const cardHeight = Math.floor((item.imageHeight * columnWidth) / item.imageWidth);
      const { index, dataList } = minHeightColumn();
      dataList.push({
        columnWidth: columnWidth,
        imageHeight: cardHeight,
        imageWidth: columnWidth,
        url: item.url,
        info: item.info,
      });
      columnsArr[index].columnHeight += cardHeight + gap;
    });
  }
  handleData(waterFullData);

  return (
    <>
      <div
        className={clsx(styles['work-list-container'], 'water-container', 'flex')}
        ref={containerRef}
        style={{ gap: gap }}
      >
        {columnsArr.map((item, index) => {
          return (
            <div key={index} className={'water-col-' + index} style={{ width: getColumnWidth() }}>
              {item.dataList.map((item, index) => {
                return (
                  <div key={index} className="water-item  mb-2">
                    {children({ ...item } as ChildProps)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default WaterFull;
