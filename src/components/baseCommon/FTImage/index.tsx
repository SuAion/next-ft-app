import Image from 'next/image';
import styles from './index.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
interface PropsType {
  src: string;
  className?: string;
  [key: string]: any;
  banRight?: boolean;
  errorUrl?: any;
  needIcon?: number;
  autoFix?: boolean;
  needWorkId?: string;
}
const FTImage = (props: PropsType) => {
  const { src, className, banRight = false, errorUrl, needIcon = 0, autoFix = false, needWorkId, ...arg } = props;
  const [getSrc, setSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (src !== undefined && src !== null && errorUrl) {
      let srcUrl = src;
      let img = document.createElement('img');
      img.onerror = () => {
        setLoading(false);
        setSrc(errorUrl);
      };
      img.src = srcUrl;
    }
  }, [src, errorUrl]);

  const extendProps = useRef(Object.assign({}, needWorkId ? { 'data-ft-share': needWorkId } : {}));

  return (
    <div className={clsx(styles['container'], className && className)}>
      <Image
        {...extendProps.current}
        className={clsx(autoFix && styles['fix'])}
        onLoad={() => {
          setLoading(false);
        }}
        alt=""
        src={getSrc}
        {...arg}
      />
      {(loading || !src) && <div className={clsx(styles['loading'], 'public-skeleton-loading')}></div>}
    </div>
  );
};

export default FTImage;
