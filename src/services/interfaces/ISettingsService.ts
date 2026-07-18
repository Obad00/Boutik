import type { ShopSettings } from '../../types';

export interface ISettingsService {
  get(shop_id: string): Promise<ShopSettings>;
  update(shop_id: string, input: Partial<ShopSettings>): Promise<ShopSettings>;
}
