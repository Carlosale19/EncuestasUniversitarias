import { useAuthStore } from '@/features/auth/hooks/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

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

  const response = await fetch(`${API_URL}${path}`, {
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
