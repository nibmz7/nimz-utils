import { useCallback, useState } from 'react';

import { Coordinate } from './helper';

export interface OverlayState {
  reference?: HTMLElement | Coordinate | null;
  isVisible?: boolean;
}

type ShowOverlayArg =
  | OverlayState['reference']
  | {
      currentTarget?: HTMLElement;
    };

const useOverlayView = (
  initialState: OverlayState = {}
): [OverlayState, (e?: ShowOverlayArg) => void, () => void] => {
  const [overlayState, _setOverlayState] = useState<OverlayState>(initialState);

  const showOverlay = useCallback((e?: ShowOverlayArg) => {
    const currentTarget = (e as MouseEvent)?.currentTarget as HTMLElement;
    _setOverlayState({
      isVisible: true,
      reference: currentTarget || e,
    });
  }, []);

  const hideOverlay = useCallback(() => {
    _setOverlayState({
      isVisible: false,
      reference: null,
    });
  }, []);

  return [overlayState, showOverlay, hideOverlay];
};

export default useOverlayView;
