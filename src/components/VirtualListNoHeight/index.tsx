import React, { useEffect, useRef, useState, useCallback } from 'react';
import style from './index.module.scss';
import { rafThrottle } from '@/utils';

interface IPosInfo {
  index: number;
  height: number;
  top: number;
  bottom: number;
  dHeight: number;
}

interface IEstimatedListProps<T> {
  children: () => React.ReactNode;
  dataSource: T[];
  estimatedHeight: number;
  getMoreData: () => void;
}

function VirtualListNoHeight<T extends { id: number }>({ dataSource, children, estimatedHeight, getMoreData }: IEstimatedListProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [positions, setPositions] = useState<IPosInfo[]>([]);
  const positionCache = useRef<Map<number, IPosInfo>>(new Map());
  const [state, setState] = useState({
    viewHeight: 0,
    listHeight: 0,
    startIndex: 0,
    maxCount: 0,
    preLen: 0,
  });

  const endIndex = Math.min(dataSource.length, state.startIndex + state.maxCount);

  const renderList = dataSource.slice(state.startIndex, endIndex);

  const offsetDis = state.startIndex > 0 ? positions[state.startIndex - 1].bottom : 0;

  const scrollStyle = {
    height: `${state.listHeight - offsetDis}px`,
    transform: `translate3d(0, ${offsetDis}px, 0)`,
  };

  const initPosition = () => {
    const pos: IPosInfo[] = [];
    const disLen = dataSource.length - state.preLen;
    const currentLen = positions.length;
    const preBottom = positions[currentLen - 1] ? positions[currentLen - 1].bottom : 0;
    for (let i = 0; i < disLen; i++) {
      const item = dataSource[state.preLen + i];
      pos.push({
        index: item.id,
        height: estimatedHeight,
        top: preBottom ? preBottom + i * estimatedHeight : item.id * estimatedHeight,
        bottom: preBottom ? preBottom + (i + 1) * estimatedHeight : (item.id + 1) * estimatedHeight,
        dHeight: 0,
      });
    }
    setPositions([...positions, ...pos]);
    setState((prevState) => ({ ...prevState, preLen: dataSource.length }));
  };

  const setPosition = () => {
    const nodes = listRef.current?.children;
    if (!nodes || !nodes.length) return;

    // 使用缓存优化性能
    const cachedPositions = [...positions];

    Array.from(nodes).forEach((node) => {
      const rect = node.getBoundingClientRect();

      const item = positions[+node.id];
      console.log(item)
      const dHeight = item.height - rect.height;
      console.log('=======>dHeight', dHeight)
      if (dHeight) {
        item.height = rect.height;
        item.bottom = item.bottom - dHeight;
        item.dHeight = dHeight;
        // 更新缓存
        positionCache.current.set(item.index, { ...item });
      } else if (positionCache.current.has(item.index)) {
        // 从缓存恢复
        const cachedItem = positionCache.current.get(item.index)!;
        item.height = cachedItem.height;
        item.bottom = cachedItem.bottom;
      }
    });

    const startId = +nodes[0].id;
    const len = positions.length;
    let startHeight = positions[startId].dHeight;
    positions[startId].dHeight = 0;

    for (let i = startId + 1; i < len; i++) {
      const item = positions[i];
      item.top = positions[i - 1].bottom;
      item.bottom = item.bottom - startHeight;
      if (item.dHeight !== 0) {
        startHeight += item.dHeight;
        item.dHeight = 0;
      }
    }
    setState((prevState) => ({ ...prevState, listHeight: positions[len - 1].bottom }));
  }

  const init = () => {
    setState((prevState) => ({
      ...prevState,
      viewHeight: containerRef.current ? containerRef.current.offsetHeight : 0,
      maxCount: Math.ceil((containerRef.current?.offsetHeight || 0) / estimatedHeight) + 1,
    }));
    containerRef.current?.addEventListener('scroll', handleScroll);
  };

  const destroy = () => {
    containerRef.current?.removeEventListener('scroll', handleScroll);
  };

  const handleScroll = useCallback(rafThrottle(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    setState((prevState) => ({ ...prevState, startIndex: binarySearch(positions, scrollTop) }));
    const bottom = scrollHeight - clientHeight - scrollTop;
    if (bottom <= 20) {
      try {
        getMoreData();
      } catch (error) {
        console.error('Error loading more data:', error);
      }
    }
  }), [positions, getMoreData]);

  const binarySearch = (list: IPosInfo[], value: number) => {
    let left = 0,
      right = list.length - 1,
      templateIndex = -1;
    while (left < right) {
      const midIndex = Math.floor((left + right) / 2);
      const midValue = list[midIndex].bottom;
      if (midValue === value) return midIndex + 1;
      else if (midValue < value) left = midIndex + 1;
      else if (midValue > value) {
        if (templateIndex === -1 || templateIndex > midIndex) templateIndex = midIndex;
        right = midIndex;
      }
    }
    return templateIndex;
  };

  useEffect(() => {
    try {
      init();
    } catch (error) {
      console.error('Error initializing virtual list:', error);
    }
    return () => {
      destroy();
    };
  }, []);

  useEffect(() => {
    initPosition();
    setTimeout(() => {
      setPosition();
    }, 0);
  }, [dataSource.length]);

  useEffect(() => {
    setPosition();
  }, [state.startIndex]);

  return (
    <div className={style['fs-estimated-virtuallist-container']} ref={containerRef}>
      <div className={style['fs-estimated-virtuallist-list']} ref={listRef} style={scrollStyle}>
        {renderList.map((item) => (
          <div className={style['fs-estimated-virtuallist-list-item']} key={item.id} id={String(item.id)}>
            {children()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualListNoHeight;
