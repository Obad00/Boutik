import { create } from 'zustand';
import type { StockMovement } from '../types';
import { stockMovementsService, productsService } from '../services/client';

interface StockMovementsState {
  movements: StockMovement[];
  isLoading: boolean;
  fetchAll: (shop_id: string) => Promise<void>;
  restock: (shop_id: string, product_id: string, product_name: string, quantity: number) => Promise<void>;
}

export const useStockMovementsStore = create<StockMovementsState>((set, get) => ({
  movements: [],
  isLoading: false,

  fetchAll: async (shop_id) => {
    set({ isLoading: true });
    const movements = await stockMovementsService.list(shop_id);
    set({ movements, isLoading: false });
  },

  restock: async (shop_id, product_id, product_name, quantity) => {
    await productsService.adjustStock(shop_id, product_id, quantity);
    await stockMovementsService.record(shop_id, product_id, product_name, 'in', quantity, 'Réapprovisionnement');
    await get().fetchAll(shop_id);
  },
}));
