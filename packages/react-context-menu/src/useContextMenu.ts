import { debounce } from 'lodash-es';
import {
  SyntheticEvent,
  TouchEvent,
  MouseEvent,
  useCallback,
  useRef,
} from 'react';

import { Coordinate } from '../OverlayView/helper';

const LONG_PRESS_DURATION = 610;

interface ContextMenuHandlerArg {
  event: SyntheticEvent;
  coordinate: Coordinate;
}

type ContextMenuHandler = (arg: ContextMenuHandlerArg) => void;

const useContextMenu = (
  callback: ContextMenuHandler
): {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchCancel: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  onContextMenu: (e: MouseEvent) => void;
} => {
  const callbackRef = useRef<ContextMenuHandler>(callback);
  callbackRef.current = callback;

  const showContextMenu = useCallback(
    debounce<ContextMenuHandler>(
      (arg) => {
        callbackRef.current(arg);
      },
      LONG_PRESS_DURATION,
      { leading: false, trailing: true, maxWait: LONG_PRESS_DURATION }
    ),
    [callbackRef]
  );

  return {
    onTouchStart: (event: TouchEvent) => {
      const { clientX: x, clientY: y } = event.touches[0];
      showContextMenu({ event, coordinate: { x, y } });
    },
    onTouchMove: () => {
      showContextMenu.cancel();
    },
    onTouchCancel: () => {
      showContextMenu.cancel();
    },
    onTouchEnd: () => {
      showContextMenu.cancel();
    },
    onContextMenu: (event: MouseEvent) => {
      event.preventDefault();
      showContextMenu.cancel();
      callbackRef.current({
        event,
        coordinate: { x: event.clientX, y: event.clientY },
      });
    },
  };
};

export default useContextMenu;
