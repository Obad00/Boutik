import type { ISuperadminAuthService, SuperadminSession } from '../interfaces';
import { apiFetch, clearToken, getToken, setToken } from './http';

interface SuperadminLoginResponse {
  token: string;
  superadmin: SuperadminSession;
}

class ApiSuperadminAuthService implements ISuperadminAuthService {
  async login(email: string, password: string): Promise<SuperadminSession | null> {
    try {
      const res = await apiFetch<SuperadminLoginResponse>('/superadmin/login', {
        method: 'POST',
        body: { email, password },
        scope: 'none',
      });
      setToken('superadmin', res.token);
      return res.superadmin;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return getToken('superadmin');
  }

  logout(): void {
    clearToken('superadmin');
  }
}

export const superadminAuthService = new ApiSuperadminAuthService();
