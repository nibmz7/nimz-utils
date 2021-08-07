import React, { Children, cloneElement, useCallback } from 'react';

import { ChildWithRef } from '../types';

import useRouteTransition, {
  useRouteTransitionArgs,
} from './useRouteTransition';

interface RouteTransitionProps extends useRouteTransitionArgs {
  children: ChildWithRef;
}
interface GroupRouteTransitionProps
  extends Omit<useRouteTransitionArgs, 'onMount' | 'onUnmount'> {
  children: ChildWithRef[] | ChildWithRef;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  ...rest
}) => {
  const [refCallback, matchPath] = useRouteTransition({
    ...rest,
  });

  const childRefCallback = children?.ref;

  const memoizedRefCallback = useCallback(
    (node: HTMLElement | null) => {
      refCallback(node);
      if (typeof childRefCallback === 'function') childRefCallback(node);
    },
    [childRefCallback, refCallback]
  );

  return (
    <>
      {matchPath &&
        cloneElement(children as JSX.Element, {
          ref: memoizedRefCallback,
        })}
    </>
  );
};

export const GroupRouteTransition: React.FC<GroupRouteTransitionProps> = ({
  children,
  ...rest
}) => {
  return (
    <>
      {Children.map(children, (child) => (
        <RouteTransition {...rest}>{child as ChildWithRef}</RouteTransition>
      ))}
    </>
  );
};
