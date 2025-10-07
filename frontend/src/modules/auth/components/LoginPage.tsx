import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingScreen } from '../../../shared/components/LoadingScreen';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

type AuthFormType = 'login' | 'register';

const FEATURE_HIGHLIGHTS = [
  'Upload and sync edits instantly across your entire team.',
  'Review cuts, leave frame-accurate feedback, and approve faster.',
  'Keep every project organized with secure cloud workspaces.',
];

export function LoginPage() {
  const { isAuthenticated, status, hasInitialized } = useAuth();
  const [formType, setFormType] = useState<AuthFormType>('login');
  const isRestoringSession = status === 'checking' && !hasInitialized;

  if (isRestoringSession) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const renderForm =
    formType === 'login' ? (
      <LoginForm onSwitchToRegister={() => setFormType('register')} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setFormType('login')} />
    );

  return (
    <main className="min-h-screen bg-base-200">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 lg:flex-row lg:items-stretch lg:px-8">
        <aside className="card hidden w-full max-w-sm overflow-hidden text-primary-content lg:flex">
          <div className="card-body justify-between gap-10">
            <div className="space-y-6">
              <span className="badge badge-outline border-primary-content/60 bg-primary-content/10 text-xs uppercase tracking-[0.35em] text-primary-content">
                VIDSYNC
              </span>
              <h2 className="card-title text-3xl leading-snug">
                Craft content that stays in sync from first draft to final
                export.
              </h2>
              <p className="text-sm text-primary-content/80">
                VidSync brings editors, producers, and stakeholders together
                with real-time previews, inline comments, and version tracking
                designed for fast-moving teams.
              </p>
            </div>

            <ul className="space-y-4 text-sm text-primary-content/80">
              {FEATURE_HIGHLIGHTS.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="badge badge-primary badge-xs"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="card w-full flex-1 bg-base-100 ">
          <div className="card-body px-4 py-8 sm:px-8 md:px-12 md:py-12">
            {renderForm}
          </div>
        </section>
      </div>
    </main>
  );
}
