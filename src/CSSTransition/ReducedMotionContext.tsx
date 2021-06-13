import React, { createContext, useCallback, useState } from 'react';

const REDUCED_MOTION_KEY = 'REDUCED_MOTION_ENABLED';

interface ReducedMotionContextValue {
  reducedMotionEnabled: boolean;
  setReducedMotionEnabled: (arg: boolean) => void;
}

export const ReducedMotionContext = createContext<ReducedMotionContextValue>(
  {} as ReducedMotionContextValue
);

const ReducedMotionContextProvider: React.FC = ({ children }) => {
  const [reducedMotionEnabled, _setReducedMotionEnabled] = useState<boolean>(
    localStorage.getItem(REDUCED_MOTION_KEY) === 'true'
  );

  const setReducedMotionEnabled = useCallback(
    (enabled: boolean) => {
      localStorage.setItem(REDUCED_MOTION_KEY, enabled ? 'true' : 'false');
      _setReducedMotionEnabled(enabled);
    },
    [_setReducedMotionEnabled]
  );

  return (
    <ReducedMotionContext.Provider
      value={{ reducedMotionEnabled, setReducedMotionEnabled }}
    >
      {children}
    </ReducedMotionContext.Provider>
  );
};

export default ReducedMotionContextProvider;
