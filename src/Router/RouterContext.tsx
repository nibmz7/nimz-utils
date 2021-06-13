import React, { createContext, useMemo } from 'react';

import BrowserRouter from './BrowserRouter';

export const RouterContext = createContext<BrowserRouter>({} as BrowserRouter);

const RouterProvider: React.FC = ({ children }) => {
  const router = useMemo(() => new BrowserRouter(), []);

  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
};

export default RouterProvider;
