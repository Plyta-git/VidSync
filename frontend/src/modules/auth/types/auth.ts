export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthTokensResponse {
  access_token: string;
}

export interface UserProfile {
  id: number;
  email: string;
  nickname?: string | null;
  createdAt?: string;
  updatedAt?: string;
}