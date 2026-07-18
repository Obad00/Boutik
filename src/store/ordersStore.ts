import { create } from 'zustand';
import type { Order } from '../types';
import { ordersService } from '../services/client';
import type { CreateOrderInput } from '../services/interfaces';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  lastOrder: Order | null;
  fetchAll: (shop_id: string) => Promise<void>;
  createOrder: (shop_id: string, input: CreateOrderInput) => Promise<Order>;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  lastOrder: null,

  fetchAll: async (shop_id) => {
    set({ isLoading: true });
    const orders = await ordersService.list(shop_id);
    set({ orders, isLoading: false });
  },

  createOrder: async (shop_id, input) => {
    const order = await ordersService.create(shop_id, input);
    set({ lastOrder: order });
    await get().fetchAll(shop_id);
    return order;
  },
}));
