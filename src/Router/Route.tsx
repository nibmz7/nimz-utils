import React from 'react';
import useRouteMatch from './useRouteMatch';

interface RouteProps {
  path: string;
}

const Route: React.FC<RouteProps> = ({ path, children }) => {
  const match = useRouteMatch(path);

  return <>{match && children}</>;
};

export const RouteInfo: React.FC<RouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default Route;
