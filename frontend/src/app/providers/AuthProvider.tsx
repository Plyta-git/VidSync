import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchCurrentUser, signIn } from '../../features/auth/api/authApi';
import type {
  AuthCredentials,
  UserProfile,
} from '../../features/auth/types/auth';
import { HttpError } from '../../lib/http/client';

const TOKEN_STORAGE_KEY = 'vidsync.auth.token';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: UserProfile | null;
}

interface AuthContextValue {
  status: AuthStatus;
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<UserProfile>;
}

const initialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

async function resolveUser(token: string) {
  return fetchCurrentUser(token);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        setState({ status: 'unauthenticated', token: null, user: null });
        return;
      }

      try {
        const user = await resolveUser(storedToken);
        setState({ status: 'authenticated', token: storedToken, user });
      } catch (error) {
        console.error('Failed to restore user session', error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setState({ status: 'unauthenticated', token: null, user: null });
      }
    };

    bootstrap();
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    setState((current) => ({ ...current, status: 'checking' }));

    try {
      const { accessToken } = await signIn(credentials);
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);

      const user = await resolveUser(accessToken);
      setState({ status: 'authenticated', token: accessToken, user });
    } catch (error) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setState({ status: 'unauthenticated', token: null, user: null });

      if (error instanceof HttpError) {
        throw error;
      }

      console.error('Unexpected error during login', error);
      throw new Error('Unexpected error during login. Please try again.');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setState({ status: 'unauthenticated', token: null, user: null });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.token) {
      throw new Error('Cannot refresh user without an access token.');
    }

    const user = await resolveUser(state.token);
    setState((current) => ({ ...current, user }));
    return user;
  }, [state.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      isAuthenticated: state.status === 'authenticated',
      token: state.token,
      user: state.user,
      login,
      logout,
      refreshUser,
    }),
    [state.status, state.token, state.user, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
