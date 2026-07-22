import type { IAuthService } from '../interfaces';
import type { AuthSession } from '../../types';
import { db } from './db';

const SESSION_KEY = 'boutik_session';

class MockAuthService implements IAuthService {
  async loginWithShopCode(shop_code: string): Promise<AuthSession | null> {
    const code = shop_code.trim().toUpperCase();
    const shop_id = db.shopCodes[code];
    if (!shop_id) return null;
    const shop = db.shops.find((s) => s.id === shop_id);
    if (!shop) return null;
    const session: AuthSession = {
      shop,
      owner: { id: `owner_${shop_id}`, shop_id, name: 'Propriétaire', role: 'owner' },
    };
    this.persist(session);
    return session;
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
  }

  async verifyAdminPin(pin: string): Promise<boolean> {
    const session = this.getSession();
    if (!session) return false;
    const settings = db.settings.find((s) => s.shop_id === session.shop.id);
    return settings?.admin_pin === pin;
  }

  private persist(session: AuthSession) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export const authService = new MockAuthService();
