import type { IShopsService, CreateShopInput, CreatedShop } from '../interfaces';
import type { Shop } from '../../types';
import { db, uid, nowISO, generateUniqueShopCode } from './db';

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

class MockShopsService implements IShopsService {
  async list(): Promise<Shop[]> {
    await delay(100);
    return [...db.shops].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async create(input: CreateShopInput): Promise<CreatedShop> {
    await delay();
    const shop_id = uid('shop');
    const code = generateUniqueShopCode(input.name);

    const shop: Shop = {
      id: shop_id,
      name: input.name,
      address: input.address,
      phone: input.phone,
      is_active: true,
      created_at: nowISO(),
    };
    db.shops.push(shop);
    db.shopCodes[code] = shop_id;

    // Paramètres par défaut + une catégorie de départ, pour que la boutique
    // soit immédiatement utilisable dès la première connexion du boutiquier.
    db.settings.push({
      id: uid('set'),
      shop_id,
      shop_name: input.name,
      address: input.address,
      phone: input.phone,
      receipt_footer: 'Merci de votre visite !',
      admin_pin: '1234',
    });
    db.categories.push({ id: uid('cat'), shop_id, name: 'Général' });

    return { shop, code };
  }

  async update(shop_id: string, input: Partial<CreateShopInput>): Promise<Shop> {
    await delay();
    const shop = db.shops.find((s) => s.id === shop_id);
    if (!shop) throw new Error('Boutique introuvable');
    Object.assign(shop, input);

    // Garde les paramètres de la boutique (utilisés sur le ticket) synchronisés
    const settings = db.settings.find((s) => s.shop_id === shop_id);
    if (settings) {
      if (input.name) settings.shop_name = input.name;
      if (input.address) settings.address = input.address;
      if (input.phone) settings.phone = input.phone;
    }

    return shop;
  }

  async getCode(shop_id: string): Promise<string | undefined> {
    await delay(50);
    return Object.entries(db.shopCodes).find(([, id]) => id === shop_id)?.[0];
  }

  async deactivate(shop_id: string): Promise<void> {
    await delay();
    const shop = db.shops.find((s) => s.id === shop_id);
    if (shop) shop.is_active = false;
  }

  async reactivate(shop_id: string): Promise<Shop> {
    await delay();
    const shop = db.shops.find((s) => s.id === shop_id);
    if (!shop) throw new Error('Boutique introuvable');
    shop.is_active = true;
    return shop;
  }
}

export const shopsService = new MockShopsService();
