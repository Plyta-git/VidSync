import { Navigate } from 'react-router-dom';
import { LoadingScreen } from '../../../shared/components/LoadingScreen';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const { isAuthenticated, status, hasInitialized } = useAuth();
  const isRestoringSession = status === 'checking' && !hasInitialized;

  if (isRestoringSession) {
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
