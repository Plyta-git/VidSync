const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  token?: string | null;
  body?: TBody;
  headers?: Record<string, string>;
}

export type HttpResponseShape<TData> = TData;

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

function buildHeaders(token?: string | null, headers?: Record<string, string>) {
  const merged = new Headers({
    'Content-Type': 'application/json',
    ...headers,
  });

  if (token) {
    merged.set('Authorization', `Bearer ${token}`);
  }

  return merged;
}

function parseErrorMessage(payload: unknown, statusText: string) {
  if (!payload) return statusText;

  if (typeof payload === 'string') {
    return payload;
  }

  if (typeof payload === 'object' && payload !== null) {
    const maybeMessage = (payload as { message?: unknown }).message;

    if (Array.isArray(maybeMessage)) {
      return maybeMessage.join(', ');
    }

    if (maybeMessage) {
      return String(maybeMessage);
    }
  }

  return statusText;
}

export async function httpRequest<TResponse, TBody = unknown>(
  path: string,
  options: HttpRequestOptions<TBody> = {},
): Promise<HttpResponseShape<TResponse>> {
  const { method = 'GET', body, token, headers } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers
    .get('Content-Type')
    ?.includes('application/json');
  const payload = isJson
    ? await response.json().catch(() => undefined)
    : await response.text().catch(() => undefined);

  if (!response.ok) {
    const message = parseErrorMessage(payload, response.statusText);
    throw new HttpError(response.status, message, payload);
  }

  return payload as HttpResponseShape<TResponse>;
}
