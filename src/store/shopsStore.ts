import { create } from 'zustand';
import type { Shop } from '../types';
import { shopsService } from '../services/client';
import type { CreateShopInput } from '../services/interfaces';

interface ShopWithCode extends Shop {
  code: string;
}

interface ShopsState {
  shops: ShopWithCode[];
  isLoading: boolean;
  lastCreatedCode: string | null;
  fetchAll: () => Promise<void>;
  createShop: (input: CreateShopInput) => Promise<{ shop: Shop; code: string }>;
  updateShop: (shop_id: string, input: Partial<CreateShopInput>) => Promise<void>;
  deactivateShop: (shop_id: string) => Promise<void>;
  reactivateShop: (shop_id: string) => Promise<void>;
}

export const useShopsStore = create<ShopsState>((set, get) => ({
  shops: [],
  isLoading: false,
  lastCreatedCode: null,

  fetchAll: async () => {
    set({ isLoading: true });
    const shops = await shopsService.list();
    const withCodes = await Promise.all(
      shops.map(async (s) => ({ ...s, code: (await shopsService.getCode(s.id)) ?? '—' }))
    );
    set({ shops: withCodes, isLoading: false });
  },

  createShop: async (input) => {
    const result = await shopsService.create(input);
    set({ lastCreatedCode: result.code });
    await get().fetchAll();
    return result;
  },

  updateShop: async (shop_id, input) => {
    await shopsService.update(shop_id, input);
    await get().fetchAll();
  },

  deactivateShop: async (shop_id) => {
    await shopsService.deactivate(shop_id);
    await get().fetchAll();
  },

  reactivateShop: async (shop_id) => {
    await shopsService.reactivate(shop_id);
    await get().fetchAll();
  },
}));
