import { useAuth } from '../../auth/hooks/useAuth';

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-xl space-y-6 rounded-lg bg-base-100 p-10 shadow-lg">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-base-content/70">Profile</p>
            <h1 className="text-3xl font-semibold text-base-content">Welcome back!</h1>
          </div>
          <button type="button" className="btn btn-outline" onClick={logout}>
            Sign out
          </button>
        </header>

        <section className="space-y-4">
          <div className="rounded-lg bg-base-200/60 p-6">
            <p className="text-sm text-base-content/70">Email address</p>
            <p className="text-xl font-medium text-base-content">
              {user?.email ?? 'Unknown user'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
