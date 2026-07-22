// Client HTTP partagé par tous les services api/*.ts.
// Gère l'URL de base, le token Bearer (par guard), et la mise en forme des erreurs
// pour que les stores existants (qui font déjà try/catch autour des appels aux
// services) continuent de fonctionner sans changement.

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api';

export type AuthScope = 'shop' | 'superadmin' | 'none';

const TOKEN_KEYS: Record<Exclude<AuthScope, 'none'>, string> = {
  shop: 'boutik_token',
  superadmin: 'boutik_superadmin_token',
};

export function getToken(scope: Exclude<AuthScope, 'none'>): string | null {
  return sessionStorage.getItem(TOKEN_KEYS[scope]);
}

export function setToken(scope: Exclude<AuthScope, 'none'>, token: string): void {
  sessionStorage.setItem(TOKEN_KEYS[scope], token);
}

export function clearToken(scope: Exclude<AuthScope, 'none'>): void {
  sessionStorage.removeItem(TOKEN_KEYS[scope]);
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  scope?: AuthScope;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', body, scope = 'shop' } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (scope !== 'none') {
    const token = getToken(scope);
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(json?.error ?? 'Une erreur est survenue');
  }

  return json as T;
}
