import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fetchCurrentUser, signIn as requestSignIn } from '../api/authApi';
import type { AuthCredentials, UserProfile } from '../types/auth';
import { setAuthToken } from '../../../lib/http/client';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthStoreState {
  status: AuthStatus;
  token: string | null;
  user: UserProfile | null;
  hasInitialized: boolean;
  initialize: () => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<UserProfile>;
}

const initialState: Pick<AuthStoreState, 'status' | 'token' | 'user' | 'hasInitialized'> = {
  status: 'checking',
  token: null,
  user: null,
  hasInitialized: false,
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      async initialize() {
        if (get().hasInitialized) {
          return;
        }

        const token = get().token;

        if (!token) {
          set({
            status: 'unauthenticated',
            user: null,
            hasInitialized: true,
          });
          setAuthToken(null);
          return;
        }

        set({ status: 'checking' });
        setAuthToken(token);

        try {
          const user = await fetchCurrentUser();
          set({
            status: 'authenticated',
            user,
            hasInitialized: true,
          });
        } catch (error) {
          console.error('Failed to restore user session', error);
          setAuthToken(null);
          set({
            status: 'unauthenticated',
            token: null,
            user: null,
            hasInitialized: true,
          });
        }
      },
      async login(credentials) {
        set({ status: 'checking' });

        try {
          const { accessToken } = await requestSignIn(credentials);
          setAuthToken(accessToken);

          const user = await fetchCurrentUser();
          set({
            status: 'authenticated',
            token: accessToken,
            user,
          });
        } catch (error) {
          setAuthToken(null);
          set({
            status: 'unauthenticated',
            token: null,
            user: null,
          });
          throw error;
        }
      },
      logout() {
        setAuthToken(null);
        set({
          status: 'unauthenticated',
          token: null,
          user: null,
          hasInitialized: true,
        });
      },
      async refreshUser() {
        const token = get().token;

        if (!token) {
          throw new Error('Cannot refresh user without an access token.');
        }

        setAuthToken(token);

        const user = await fetchCurrentUser();
        set({ user });
        return user;
      },
    }),
    {
      name: 'vidsync.auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate auth store', error);
          return;
        }

        const token = state?.token ?? null;
        setAuthToken(token);
      },
    },
  ),
);
