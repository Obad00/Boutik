import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useShop();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
