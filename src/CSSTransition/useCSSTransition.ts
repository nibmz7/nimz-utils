import {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { ReducedMotionContext } from './ReducedMotionContext';

enum VISIBILITY {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
}

export interface useCSSTransitionArgs {
  lastHideTransitionProperty?: string;
  prepareDimensions?: boolean;
  onUnmount?: () => void;
  onMount?: (element: HTMLElement) => void;
}

interface StateRef extends useCSSTransitionArgs {
  element: HTMLElement | null;
  hasUnmounted: boolean;
  isVisible: boolean;
  reducedMotionEnabled: boolean;
}

const useCSSTransition = (
  args: useCSSTransitionArgs = {}
): [
  (element: HTMLElement | null) => void,
  boolean,
  (visible: boolean) => void,
  StateRef
] => {
  const {
    lastHideTransitionProperty: argLastHideTransitionProperty = 'opacity',
    prepareDimensions: argAnimateHeight = false,
    onUnmount: argOnUnmount,
    onMount: argOnMount,
  } = args;

  const [shouldMount, setMount] = useState(false);
  const { reducedMotionEnabled: contextReducedMotionEnabled } = useContext(
    ReducedMotionContext
  );

  const stateRef = useRef<StateRef>({
    element: null,
    hasUnmounted: false,
    isVisible: false,
    lastHideTransitionProperty: argLastHideTransitionProperty,
    prepareDimensions: argAnimateHeight,
    reducedMotionEnabled: contextReducedMotionEnabled,
  }).current;

  stateRef.lastHideTransitionProperty = argLastHideTransitionProperty;
  stateRef.reducedMotionEnabled = contextReducedMotionEnabled;
  stateRef.prepareDimensions = argAnimateHeight;
  stateRef.onUnmount = argOnUnmount;
  stateRef.onMount = argOnMount;

  const removeFromDOM = useCallback(
    ({ propertyName, target }) => {
      const { element, isVisible, lastHideTransitionProperty } = stateRef;
      if (
        !isVisible &&
        target === element &&
        lastHideTransitionProperty === propertyName
      ) {
        if (element) {
          element.removeEventListener('transitionend', removeFromDOM);
          stateRef.element = null;
        }
        setMount(false);
      }
    },
    [stateRef]
  );

  const animateShow = useCallback(
    (firstMount: boolean) => {
      const {
        element,
        reducedMotionEnabled,
        isVisible,
        prepareDimensions,
      } = stateRef;

      if (element) {
        if (reducedMotionEnabled) {
          element.style.transition = 'none';
        }
        element.removeEventListener('transitionend', removeFromDOM);
        if (!isVisible) {
          stateRef.isVisible = true;
          if (firstMount) {
            element.getBoundingClientRect();
            if (prepareDimensions) {
              const clientHeight = `${element.clientHeight}px`;
              const clientWidth = `${element.clientWidth}px`;
              element.style.setProperty('--client-height', clientHeight);
              element.style.setProperty('--client-width', clientWidth);
            }
          }
        }
        element.dataset.visibility = VISIBILITY.VISIBLE;
        element.style.pointerEvents = '';
      } else setMount(true);
    },
    [removeFromDOM, stateRef]
  );

  const animateHide = useCallback(() => {
    const { element, reducedMotionEnabled } = stateRef;
    if (element) {
      if (reducedMotionEnabled) {
        setMount(false);
      } else {
        element.addEventListener('transitionend', removeFromDOM);
        stateRef.isVisible = false;
        element.dataset.visibility = VISIBILITY.HIDDEN;
        element.style.pointerEvents = 'none';
      }
    }
  }, [removeFromDOM, stateRef]);

  const refCallback = useCallback(
    (element: HTMLElement | null) => {
      stateRef.element = element;
      if (element) {
        stateRef.onMount?.(element);
        animateShow(true);
      } else stateRef.onUnmount?.();
    },
    [animateShow, stateRef]
  );

  const setVisiblity = useCallback(
    (visible: boolean) => {
      if (stateRef.hasUnmounted) return;
      if (visible) animateShow(false);
      else animateHide();
    },
    [animateHide, animateShow, stateRef]
  );

  useLayoutEffect(() => {
    return () => {
      stateRef.hasUnmounted = true;
      if (stateRef.element) {
        stateRef.element.removeEventListener('transitionend', removeFromDOM);
        stateRef.element = null;
      }
    };
  }, [removeFromDOM, stateRef]);

  return [refCallback, shouldMount, setVisiblity, stateRef];
};

export default useCSSTransition;
