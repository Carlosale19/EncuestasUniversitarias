import { useAuthStore } from '@/features/auth/hooks/useAuthStore';

declare global {
  interface Window {
    __ENV__?: {
      VITE_API_URL?: string;
    };
  }
}

function resolveApiUrl(): string {
  const runtimeUrl = typeof window !== 'undefined' ? window.__ENV__?.VITE_API_URL : undefined;
  const buildUrl = import.meta.env.VITE_API_URL;
  const target = (runtimeUrl && runtimeUrl.trim() !== '' && !runtimeUrl.startsWith('$') ? runtimeUrl : undefined) ||
    (buildUrl && buildUrl.trim() !== '' ? buildUrl : undefined) ||
    '/api';
  return target.trim().replace(/\/+$/, '');
}

const API_URL = resolveApiUrl();

type FetchOptions = RequestInit & {
  rawBody?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers);

  if (!options.rawBody) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_URL}${normalizedPath}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = 'Ocurrio un error inesperado';
    try {
      const errorPayload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(errorPayload.message)) {
        message = errorPayload.message.join(', ');
      } else if (errorPayload.message) {
        message = errorPayload.message;
      }
    } catch {
      message = response.statusText;
    }

    if (response.status === 401) {
      useAuthStore.getState().logout();
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
