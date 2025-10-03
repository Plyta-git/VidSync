import axios, { AxiosError, type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class HttpError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

function extractErrorMessage(details: unknown, fallback: string) {
  if (!details) {
    return fallback;
  }

  if (typeof details === 'string') {
    return details;
  }

  if (typeof details === 'object') {
    const maybeMessage = (details as { message?: unknown }).message;

    if (Array.isArray(maybeMessage)) {
      return maybeMessage.join(', ');
    }

    if (maybeMessage) {
      return String(maybeMessage);
    }
  }

  return fallback;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, statusText, data } = error.response;
      const message = extractErrorMessage(data, statusText);
      throw new HttpError(status, message, data);
    }

    if (error.request) {
      throw new HttpError(0, 'Unable to reach the server. Check your network connection.', error.message);
    }

    throw new HttpError(0, error.message);
  },
);

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

export { apiClient };
