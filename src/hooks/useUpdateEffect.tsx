import { useEffect, useRef } from 'react';
// @/hooks/useUpdateEffect: 自定义 Hook，类似于 useEffect，但不监听初始挂载。
function useUpdateEffect(fn: () => void | (() => void), dp: Array<any>) {
  const first = useRef(true);

  useEffect(() => {
    let result = null;
    if (first.current) {
      first.current = false;
    } else {
      result = fn();
    }

    return () => {
      result && result();
    };
  }, dp);
}
export default useUpdateEffect;
