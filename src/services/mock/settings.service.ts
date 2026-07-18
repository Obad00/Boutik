import type { ISettingsService } from '../interfaces';
import type { ShopSettings } from '../../types';
import { db } from './db';

const delay = (ms = 80) => new Promise((r) => setTimeout(r, ms));

class MockSettingsService implements ISettingsService {
  async get(shop_id: string): Promise<ShopSettings> {
    await delay();
    const s = db.settings.find((x) => x.shop_id === shop_id);
    if (!s) throw new Error('Paramètres introuvables pour cette boutique');
    return s;
  }

  async update(shop_id: string, input: Partial<ShopSettings>): Promise<ShopSettings> {
    await delay();
    const s = db.settings.find((x) => x.shop_id === shop_id);
    if (!s) throw new Error('Paramètres introuvables pour cette boutique');
    Object.assign(s, input);
    return s;
  }
}

export const settingsService = new MockSettingsService();
