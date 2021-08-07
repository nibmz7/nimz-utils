import { useContext, useLayoutEffect, useState } from 'react';

import { RouterContext } from './RouterContext';

const useRouteMatch = (pathname: string): boolean => {
  const [match, setMatch] = useState(false);
  const router = useContext(RouterContext);

  useLayoutEffect(() => {
    const { subscribe, matchRoute } = router;
    const onChange = () => {
      const result = matchRoute(pathname);
      setMatch(result.match);
    };
    const unsubscribe = subscribe(onChange);

    return () => unsubscribe();
  }, [router, pathname]);

  return match;
};

export default useRouteMatch;
