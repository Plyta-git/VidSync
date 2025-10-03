import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      status: state.status,
      isAuthenticated: state.status === 'authenticated',
      token: state.token,
      user: state.user,
      login: state.login,
      logout: state.logout,
      refreshUser: state.refreshUser,
    })),
  );
}
