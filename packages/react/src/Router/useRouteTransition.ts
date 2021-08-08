import { useContext, useLayoutEffect, useState } from 'react';

import useCSSTransition, {
  useCSSTransitionArgs,
} from '../CSSTransition/useCSSTransition';

import { RouterContext } from './RouterContext';
import { RouteMatchResult } from './BrowserRouter';

export interface useRouteTransitionArgs extends useCSSTransitionArgs {
  path: string;
}

const useRouteTransition = (
  args: useRouteTransitionArgs
): [
  (element: HTMLElement | null) => void,
  boolean,
  RouteMatchResult['params']
] => {
  const { path, ...rest } = args;

  const [refCallback, match, setViewVisiblity] = useCSSTransition({
    ...rest,
  });
  const [params, setParams] = useState<RouteMatchResult['params']>({});
  const router = useContext(RouterContext);

  useLayoutEffect(() => {
    const { subscribe, matchRoute } = router;

    const onChange = () => {
      const { match: pathMatch, params: resultParams } = matchRoute(path);
      if (pathMatch) setParams(resultParams);
      setViewVisiblity(pathMatch);
    };

    const unsubscribe = subscribe(onChange);
    onChange();

    return () => unsubscribe();
  }, [router, path, setViewVisiblity]);

  return [refCallback, match, params];
};

export default useRouteTransition;
