import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { LoadingScreen } from './LoadingScreen';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export function ProtectedRoute({ redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, status } = useAuth();

  if (status === 'checking') {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
