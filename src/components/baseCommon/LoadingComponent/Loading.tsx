import { SearchResultLoading } from '@/assets/svg';
import styles from './index.module.scss';

interface LoadingProps {
  bg?: React.CSSProperties['background'];
  svgProps?: React.SVGProps<SVGSVGElement>;
  size?: 'small' | 'large' | 'medium';
}

/** 默认占满容器的loading，无文本 */
function LoadingComponent({ bg, svgProps, size = 'large' }: LoadingProps) {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className={`${styles.container} ${styles[size]}`} style={{ background: bg }}>
      <SearchResultLoading {...svgProps} />
    </div>
  );
}

export default LoadingComponent;
