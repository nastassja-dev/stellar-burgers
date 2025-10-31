import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
  children?: ReactNode;
  onlyUnAuth?: boolean; // оставляем для совместимости
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => (
  // Временно просто рендерим детей
  <>{children || <Outlet />}</>
);

export const UnAuthRoute = ProtectedRoute;
