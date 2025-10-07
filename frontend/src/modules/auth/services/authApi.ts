import { apiClient } from '../../../lib/api/httpClient';
import type {
  AuthCredentials,
  AuthTokens,
  AuthTokensResponse,
  UserProfile,
} from '../types/auth';

const SIGN_IN_ENDPOINT = '/auth/signin';
const SIGN_UP_ENDPOINT = '/auth/signup';
const CURRENT_USER_ENDPOINT = '/users/me';

export async function signIn(
  credentials: AuthCredentials,
): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokensResponse>(
    SIGN_IN_ENDPOINT,
    credentials,
  );

  return {
    accessToken: data.access_token,
  };
}

export async function signUp(credentials: AuthCredentials) {
  const { data } = await apiClient.post<AuthTokensResponse>(
    SIGN_UP_ENDPOINT,
    credentials,
  );

  return {
    accessToken: data.access_token,
  };
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>(CURRENT_USER_ENDPOINT);
  return data;
}
