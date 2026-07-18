import { create } from 'zustand';
import type { Customer, CustomerInput, CreditPayment } from '../types';
import { customersService, creditPaymentsService } from '../services/client';

interface CustomersState {
  customers: Customer[];
  payments: CreditPayment[];
  isLoading: boolean;
  fetchAll: (shop_id: string) => Promise<void>;
  createCustomer: (shop_id: string, input: CustomerInput) => Promise<Customer>;
  updateCustomer: (shop_id: string, id: string, input: Partial<CustomerInput>) => Promise<void>;
  removeCustomer: (shop_id: string, id: string) => Promise<void>;
  recordPayment: (shop_id: string, customer_id: string, customer_name: string, amount: number) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  payments: [],
  isLoading: false,

  fetchAll: async (shop_id) => {
    set({ isLoading: true });
    const [customers, payments] = await Promise.all([
      customersService.list(shop_id),
      creditPaymentsService.list(shop_id),
    ]);
    set({ customers, payments, isLoading: false });
  },

  createCustomer: async (shop_id, input) => {
    const customer = await customersService.create(shop_id, input);
    await get().fetchAll(shop_id);
    return customer;
  },

  updateCustomer: async (shop_id, id, input) => {
    await customersService.update(shop_id, id, input);
    await get().fetchAll(shop_id);
  },

  removeCustomer: async (shop_id, id) => {
    await customersService.remove(shop_id, id);
    await get().fetchAll(shop_id);
  },

  recordPayment: async (shop_id, customer_id, customer_name, amount) => {
    await creditPaymentsService.record(shop_id, customer_id, customer_name, amount);
    await get().fetchAll(shop_id);
  },
}));
