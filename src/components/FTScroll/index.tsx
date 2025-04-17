'use client';

import { useCallback, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import clsx from 'clsx';

interface FTScrollProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  onScrollToBottom?: () => void;
  loading?: boolean;
  relativeNeedDropDownData?: any[];
  showLoading?: boolean;
}

const FTScroll: React.FC<FTScrollProps> = ({
  children,
  id,
  className,
  onScrollToBottom,
  loading = false,
  relativeNeedDropDownData = [],
  showLoading = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && onScrollToBottom) {
        onScrollToBottom();
      }
    },
    [loading, onScrollToBottom],
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    if (loadingRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersect, options);
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect]);

  return (
    <div id={id} ref={containerRef} className={clsx(styles['ft-scroll-container'], className)}>
      {children}
      <div ref={loadingRef} className={styles['loading-trigger']}>
        {showLoading && loading && (
          <div className={styles['loading-spinner']}>
            <div className={styles['spinner']} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FTScroll;
