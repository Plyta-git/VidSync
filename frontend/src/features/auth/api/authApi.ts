import { httpRequest } from '../../../lib/http/client';
import type {
  AuthCredentials,
  AuthTokens,
  AuthTokensResponse,
  UserProfile,
} from '../types/auth';

const SIGN_IN_ENDPOINT = '/auth/signin';
const CURRENT_USER_ENDPOINT = '/users/me';

export async function signIn(credentials: AuthCredentials): Promise<AuthTokens> {
  const response = await httpRequest<AuthTokensResponse, AuthCredentials>(SIGN_IN_ENDPOINT, {
    method: 'POST',
    body: credentials,
  });

  return {
    accessToken: response.access_token,
  };
}

export async function fetchCurrentUser(token: string): Promise<UserProfile> {
  return httpRequest<UserProfile>(CURRENT_USER_ENDPOINT, {
    method: 'GET',
    token,
  });
}