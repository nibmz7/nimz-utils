import React, { SyntheticEvent, useEffect, useLayoutEffect, useState } from 'react';
import { isElement } from 'lodash-es';

import { ChildWithRef } from '../types';

import { CSSTransition } from '../CSSTransition/CSSTransition';
import Portal from '../Portal';
import { useCSSTransitionArgs } from '../CSSTransition/useCSSTransition';

import {
  Coordinate,
  positionElementByCoordinate,
  positionElementByReference,
} from './helper';
import { OverlayViewProps } from './OverlayView';

interface OverlayViewTransitionProps
  extends OverlayViewProps,
    useCSSTransitionArgs {
  children: ChildWithRef;
}

const OverlayViewTransition: React.FC<OverlayViewTransitionProps> = ({
  portalId = 'overlay-portal',
  enableEventPropagation = false,
  position = 'left',
  alignment = 'center',
  overlayState,
  onOutsideClick,
  scrimClassName,
  scrimLabel = 'Close overlay',
  children,
  ...rest
}) => {
  const [scrimElement, setScrimElement] = useState<HTMLElement | null>();

  const { isVisible, reference } = overlayState;

  const handleScrimOnClick = (e: SyntheticEvent) => {
    if (e.target === e.currentTarget && onOutsideClick) onOutsideClick(e);
  };

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    return () => {
      document.documentElement.style.overflowY = '';
    };
  }, []);

  useLayoutEffect(() => {
    if (scrimElement) {
      const element = scrimElement.nextElementSibling as HTMLElement;
      if (element && reference) {
        if (isElement(reference))
          positionElementByReference(
            element,
            reference as HTMLElement,
            position,
            alignment
          );
        else
          positionElementByCoordinate(
            element,
            reference as Coordinate,
            position,
            alignment
          );
      }
    }
  }, [position, alignment, scrimElement, reference]);

  return (
    <Portal id={portalId} enableEventPropagation={enableEventPropagation}>
      <CSSTransition visible={isVisible}>
        <button
          type="button"
          aria-label={scrimLabel}
          ref={setScrimElement}
          onClick={handleScrimOnClick}
          style={{
            padding: '0',
            background: 'none',
            border: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
          }}
          className={scrimClassName}
        />
      </CSSTransition>
      <CSSTransition {...rest} visible={isVisible}>
        {children}
      </CSSTransition>
    </Portal>
  );
};

const OverlayViewTransitionWrapper: React.FC<OverlayViewTransitionProps> = ({
  overlayState,
  onUnmount,
  children,
  ...rest
}) => {
  const [shouldMount, setHasMount] = useState(false);
  const { isVisible } = overlayState;

  useEffect(() => {
    if (isVisible) setHasMount(true);
  }, [isVisible]);

  return shouldMount && children ? (
    <OverlayViewTransition
      onUnmount={() => {
        setHasMount(false);
        onUnmount?.();
      }}
      overlayState={overlayState}
      {...rest}
    >
      {children}
    </OverlayViewTransition>
  ) : null;
};

export default OverlayViewTransitionWrapper;
