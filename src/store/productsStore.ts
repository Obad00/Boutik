import { create } from 'zustand';
import type { Product, ProductInput, Category } from '../types';
import { productsService, categoriesService } from '../services/client';

interface ProductsState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  fetchAll: (shop_id: string) => Promise<void>;
  createProduct: (shop_id: string, input: ProductInput) => Promise<void>;
  updateProduct: (shop_id: string, id: string, input: Partial<ProductInput>) => Promise<void>;
  removeProduct: (shop_id: string, id: string) => Promise<void>;
  createCategory: (shop_id: string, name: string) => Promise<void>;
  updateCategory: (shop_id: string, id: string, name: string) => Promise<void>;
  removeCategory: (shop_id: string, id: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,

  fetchAll: async (shop_id) => {
    set({ isLoading: true });
    const [products, categories] = await Promise.all([
      productsService.list(shop_id),
      categoriesService.list(shop_id),
    ]);
    set({ products, categories, isLoading: false });
  },

  createProduct: async (shop_id, input) => {
    await productsService.create(shop_id, input);
    await get().fetchAll(shop_id);
  },

  updateProduct: async (shop_id, id, input) => {
    await productsService.update(shop_id, id, input);
    await get().fetchAll(shop_id);
  },

  removeProduct: async (shop_id, id) => {
    await productsService.remove(shop_id, id);
    await get().fetchAll(shop_id);
  },

  createCategory: async (shop_id, name) => {
    await categoriesService.create(shop_id, name);
    await get().fetchAll(shop_id);
  },

  updateCategory: async (shop_id, id, name) => {
    await categoriesService.update(shop_id, id, name);
    await get().fetchAll(shop_id);
  },

  removeCategory: async (shop_id, id) => {
    await categoriesService.remove(shop_id, id);
    await get().fetchAll(shop_id);
  },
}));
