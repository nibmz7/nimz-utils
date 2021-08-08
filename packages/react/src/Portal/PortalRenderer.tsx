/* eslint-disable no-param-reassign */
import React, {
  createContext,
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

type AddView = (id: string, node: ReactNode) => void;
type RemoveView = (id: string) => void;

interface PortalRendererContextValue {
  addView: AddView;
  removeView: RemoveView;
}

export const PortalRendererContext = createContext<PortalRendererContextValue>(
  {} as PortalRendererContextValue
);

const PortalRenderer: React.FC = ({ children }) => {
  const [, rerender] = useState({});
  const [views, setViews] = useState<{ [id: string]: ReactNode }>({});

  const addView = useCallback((id: string, node: ReactNode) => {
    setViews((prev) => {
      prev[id] = node;

      return prev;
    });
    rerender({});
  }, []);

  const removeView = useCallback((id: string) => {
    setViews((prev) => {
      delete prev[id];

      return prev;
    });
    rerender({});
  }, []);

  const contextValue = useMemo(() => {
    return { addView, removeView };
  }, [addView, removeView]);

  return (
    <PortalRendererContext.Provider value={contextValue}>
      {children}
      {Object.entries(views).map(([id, node]) => (
        <Fragment key={id}>{node}</Fragment>
      ))}
    </PortalRendererContext.Provider>
  );
};

export default PortalRenderer;
