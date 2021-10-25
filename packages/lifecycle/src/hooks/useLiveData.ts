import { useEffect, useRef, useState } from 'react';

import { LifecycleOwner } from '../lifecycle/LifecycleOwner';
import LiveData from '../livedata/LiveData';

interface useLiveDataOptions<S, T> {
  liveData: LiveData<T>;
  selector: (t: T) => S | T;
  equalityFn?: (prev: S | T, next: S | T) => boolean;
  lifecycleOwner: LifecycleOwner;
}

const useLiveData = <S, T>(options: useLiveDataOptions<S, T>) => {
  const {
    liveData,
    selector = (t: T) => t,
    equalityFn,
    lifecycleOwner,
  } = options;
  const data = useRef<S | T>({} as S);
  const [, rerender] = useState({});
  const optionsRef = useRef<typeof options>({} as typeof options);
  optionsRef.current = {
    liveData,
    selector,
    equalityFn,
    lifecycleOwner,
  };

  useEffect(() => {
    const { selector, equalityFn, lifecycleOwner } = optionsRef.current;
    const unsubscribe = liveData.observe(lifecycleOwner, (t: T) => {
      const newData = selector(t);
      let hasChanged = true;
      if (equalityFn) {
        hasChanged = equalityFn(data.current, newData);
      }
      if (hasChanged) {
        data.current = newData;
        rerender({});
      }
    });

    return () => unsubscribe();
  }, []);

  return data.current;
};

export default useLiveData;
