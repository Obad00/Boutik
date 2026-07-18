import type { AuthSession } from '../../types';

export interface IAuthService {
  loginWithShopCode(shop_code: string): Promise<AuthSession | null>;
  getSession(): AuthSession | null;
  logout(): void;
}
