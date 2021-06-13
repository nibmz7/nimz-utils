import React, { SyntheticEvent, useEffect, useLayoutEffect, useState } from 'react';
import { isElement } from 'lodash-es';

import Portal from '../Portal';

import {
  Coordinate,
  OverlayViewAlignment,
  OverlayViewPosition,
  positionElementByCoordinate,
  positionElementByReference,
} from './helper';
import { OverlayState } from './useOverlayView';

export interface OverlayViewProps {
  portalId?: string;
  enableEventPropagation?: boolean;
  overlayState: OverlayState;
  onOutsideClick?: (e: SyntheticEvent) => void;
  position?: OverlayViewPosition;
  alignment?: OverlayViewAlignment;
  scrimClassName?: string;
  scrimLabel?: string;
}

const OverlayView: React.FC<OverlayViewProps> = ({
  portalId = 'overlay-portal',
  enableEventPropagation = false,
  position = 'left',
  alignment = 'center',
  overlayState,
  onOutsideClick,
  scrimLabel = 'Close overlay',
  scrimClassName = '',
  children,
}) => {
  const [scrimElement, setScrimElement] = useState<HTMLElement | null>();

  const { reference } = overlayState;

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    return () => {
      document.documentElement.style.overflowY = '';
    };
  }, []);

  const handleScrimOnClick = (e: SyntheticEvent) => {
    if (e.target === e.currentTarget && onOutsideClick) {
      onOutsideClick(e);
    }
  };

  useLayoutEffect(() => {
    if (scrimElement) {
      const element = scrimElement.nextElementSibling as HTMLElement;
      if (element && reference) {
        if (isElement(reference)) {
          positionElementByReference(
            element,
            reference as HTMLElement,
            position,
            alignment
          );
        } else {
          positionElementByCoordinate(
            element,
            reference as Coordinate,
            position,
            alignment
          );
        }
      }
    }
  }, [position, alignment, scrimElement, reference]);

  return (
    <Portal id={portalId} enableEventPropagation={enableEventPropagation}>
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
      {children}
    </Portal>
  );
};

const OverlayViewWrapper: React.FC<OverlayViewProps> = ({
  overlayState,
  children,
  ...rest
}) => {
  const { isVisible } = overlayState;

  return isVisible && children ? (
    <OverlayView overlayState={overlayState} {...rest}>
      {children}
    </OverlayView>
  ) : null;
};

export default OverlayViewWrapper;
