import { Navigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginForm } from '../features/auth/components/LoginForm';
import { useAuth } from '../features/auth/hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated, status } = useAuth();

  if (status === 'checking') {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <LoginForm />
    </div>
  );
}