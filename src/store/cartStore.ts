import { create } from 'zustand';
import type { CartLine, Product } from '../types';

interface CartState {
  lines: CartLine[];
  addProduct: (product: Product, quantity?: number) => void;
  incrementLine: (product_id: string, step?: number) => void;
  decrementLine: (product_id: string, step?: number) => void;
  setQuantity: (product_id: string, quantity: number) => void;
  removeLine: (product_id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],

  addProduct: (product, quantity = 1) => {
    set((state) => {
      const existing = state.lines.find((l) => l.product_id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock_quantity);
        return {
          lines: state.lines.map((l) => (l.product_id === product.id ? { ...l, quantity: newQty } : l)),
        };
      }
      const qty = Math.min(quantity, product.stock_quantity);
      if (qty <= 0) return state;
      const line: CartLine = {
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price_sell,
        quantity: qty,
        unit: product.unit,
        stock_available: product.stock_quantity,
      };
      return { lines: [...state.lines, line] };
    });
  },

  incrementLine: (product_id, step = 1) => {
    set((state) => ({
      lines: state.lines.map((l) =>
        l.product_id === product_id ? { ...l, quantity: Math.min(l.quantity + step, l.stock_available) } : l
      ),
    }));
  },

  decrementLine: (product_id, step = 1) => {
    set((state) => ({
      lines: state.lines
        .map((l) => (l.product_id === product_id ? { ...l, quantity: l.quantity - step } : l))
        .filter((l) => l.quantity > 0),
    }));
  },

  setQuantity: (product_id, quantity) => {
    set((state) => ({
      lines: state.lines
        .map((l) => (l.product_id === product_id ? { ...l, quantity: Math.min(Math.max(quantity, 0), l.stock_available) } : l))
        .filter((l) => l.quantity > 0),
    }));
  },

  removeLine: (product_id) => {
    set((state) => ({ lines: state.lines.filter((l) => l.product_id !== product_id) }));
  },

  clear: () => set({ lines: [] }),

  total: () => get().lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0),
}));
