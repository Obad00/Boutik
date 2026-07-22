import type { IAuthService } from '../interfaces';
import type { AuthSession } from '../../types';
import { apiFetch, clearToken, setToken } from './http';

const SESSION_KEY = 'boutik_session';

interface ShopLoginResponse {
  token: string;
  shop: AuthSession['shop'];
  owner: AuthSession['owner'];
}

class ApiAuthService implements IAuthService {
  async loginWithShopCode(shop_code: string): Promise<AuthSession | null> {
    try {
      const res = await apiFetch<ShopLoginResponse>('/auth/shop-login', {
        method: 'POST',
        body: { code: shop_code },
        scope: 'none',
      });
      setToken('shop', res.token);
      const session: AuthSession = { shop: res.shop, owner: res.owner };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    } catch {
      return null;
    }
  }

  getSession(): AuthSession | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    clearToken('shop');
  }

  async verifyAdminPin(pin: string): Promise<boolean> {
    try {
      await apiFetch<{ ok: true }>('/auth/verify-admin-pin', { method: 'POST', body: { pin } });
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new ApiAuthService();
