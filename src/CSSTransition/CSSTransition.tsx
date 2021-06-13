import React, { Children, cloneElement, useCallback, useEffect } from 'react';

import { ChildWithRef } from '../types';

import useCSSTransition, { useCSSTransitionArgs } from './useCSSTransition';

export interface CSSTransitionProps extends useCSSTransitionArgs {
  visible?: boolean;
  children: ChildWithRef;
}
export interface GroupCSSTransitionProps
  extends Omit<useCSSTransitionArgs, 'onMount' | 'onUnmount'> {
  visible?: boolean;
  children: ChildWithRef[] | ChildWithRef;
}

export const CSSTransition = (props: CSSTransitionProps): JSX.Element => {
  const { visible, children, ...rest } = props;

  const childRefCallback = children?.ref;

  const [refCallback, hasMount, setVisibility, stateRef] = useCSSTransition({
    ...rest,
  });

  const memoizedRefCallback = useCallback(
    (node: HTMLElement | null) => {
      if (stateRef.hasUnmounted) return;
      refCallback(node);
      if (typeof childRefCallback === 'function') childRefCallback(node);
    },
    [childRefCallback, refCallback, stateRef]
  );

  useEffect(() => {
    setVisibility(!!visible);
  }, [visible, setVisibility]);

  return (
    <>
      {hasMount &&
        cloneElement(children as JSX.Element, {
          ref: memoizedRefCallback,
        })}
    </>
  );
};

export const GroupCSSTransition: React.FC<GroupCSSTransitionProps> = ({
  children,
  ...rest
}) => {
  return (
    <>
      {Children.map(children, (child) => (
        <CSSTransition {...rest}>{child as ChildWithRef}</CSSTransition>
      ))}
    </>
  );
};
