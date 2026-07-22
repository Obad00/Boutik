import type { IShopsService, CreateShopInput, CreatedShop } from '../interfaces';
import type { Shop } from '../../types';
import { apiFetch } from './http';

interface ShopWithCode extends Shop {
  code: string;
}

class ApiShopsService implements IShopsService {
  async list(): Promise<Shop[]> {
    return apiFetch<ShopWithCode[]>('/superadmin/shops', { scope: 'superadmin' });
  }

  async create(input: CreateShopInput): Promise<CreatedShop> {
    return apiFetch<CreatedShop>('/superadmin/shops', { method: 'POST', body: input, scope: 'superadmin' });
  }

  async update(shop_id: string, input: Partial<CreateShopInput>): Promise<Shop> {
    return apiFetch<Shop>(`/superadmin/shops/${shop_id}`, { method: 'PUT', body: input, scope: 'superadmin' });
  }

  async getCode(shop_id: string): Promise<string | undefined> {
    // Pas de route dédiée : le code est déjà inclus dans chaque objet de
    // GET /superadmin/shops, donc on ré-appelle list() plutôt que d'inventer
    // une route absente du backend de référence.
    const shops = await this.list();
    const withCode = shops as ShopWithCode[];
    return withCode.find((s) => s.id === shop_id)?.code;
  }

  async deactivate(shop_id: string): Promise<void> {
    await apiFetch<{ ok: true }>(`/superadmin/shops/${shop_id}`, { method: 'DELETE', scope: 'superadmin' });
  }

  async reactivate(shop_id: string): Promise<Shop> {
    return apiFetch<Shop>(`/superadmin/shops/${shop_id}/reactivate`, { method: 'POST', scope: 'superadmin' });
  }
}

export const shopsService = new ApiShopsService();
