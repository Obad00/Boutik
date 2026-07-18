import { create } from 'zustand';
import type { CashMovement } from '../types';
import { cashMovementsService } from '../services/client';

interface CashState {
  movements: CashMovement[];
  isLoading: boolean;
  fetchAll: (shop_id: string) => Promise<void>;
  recordMovement: (shop_id: string, type: 'in' | 'out', amount: number, reason: string) => Promise<void>;
  todayBalance: () => number;
  todayIn: () => number;
  todayOut: () => number;
}

function isToday(iso: string): boolean {
  return iso.slice(0, 10) === new Date().toISOString().slice(0, 10);
}

export const useCashStore = create<CashState>((set, get) => ({
  movements: [],
  isLoading: false,

  fetchAll: async (shop_id) => {
    set({ isLoading: true });
    const movements = await cashMovementsService.list(shop_id);
    set({ movements, isLoading: false });
  },

  recordMovement: async (shop_id, type, amount, reason) => {
    await cashMovementsService.record(shop_id, type, amount, reason);
    const movements = await cashMovementsService.list(shop_id);
    set({ movements });
  },

  todayIn: () =>
    get()
      .movements.filter((m) => m.type === 'in' && isToday(m.created_at))
      .reduce((sum, m) => sum + m.amount, 0),

  todayOut: () =>
    get()
      .movements.filter((m) => m.type === 'out' && isToday(m.created_at))
      .reduce((sum, m) => sum + m.amount, 0),

  todayBalance: () => get().todayIn() - get().todayOut(),
}));
