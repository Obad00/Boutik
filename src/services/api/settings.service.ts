import type { ISettingsService } from '../interfaces';
import type { ShopSettings } from '../../types';
import { apiFetch } from './http';

class ApiSettingsService implements ISettingsService {
  async get(_shop_id: string): Promise<ShopSettings> {
    return apiFetch<ShopSettings>('/settings');
  }

  async update(_shop_id: string, input: Partial<ShopSettings>): Promise<ShopSettings> {
    return apiFetch<ShopSettings>('/settings', { method: 'PUT', body: input });
  }
}

export const settingsService = new ApiSettingsService();
