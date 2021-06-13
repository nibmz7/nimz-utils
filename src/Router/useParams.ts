import { useContext, useLayoutEffect, useState } from 'react';

import { RouteMatchResult } from './BrowserRouter';
import { RouterContext } from './RouterContext';

const useParams = (pathname: string): RouteMatchResult['params'] => {
  const [params, setParams] = useState({});
  const router = useContext(RouterContext);

  useLayoutEffect(() => {
    const { subscribe, matchRoute } = router;

    const onChange = () => {
      const { match, params: resultParams } = matchRoute(pathname);
      if (match) setParams(resultParams);
    };

    const unsubscribe = subscribe(onChange);
    onChange();

    return () => unsubscribe();
  }, [router, pathname]);

  return params;
};

export default useParams;
