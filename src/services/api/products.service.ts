import type { IProductsService } from '../interfaces';
import type { Product, ProductInput } from '../../types';
import { apiFetch } from './http';

class ApiProductsService implements IProductsService {
  async list(_shop_id: string): Promise<Product[]> {
    return apiFetch<Product[]>('/products');
  }

  async get(shop_id: string, id: string): Promise<Product | undefined> {
    // Pas de GET /products/:id côté backend (fidèle au contrat Node de référence) —
    // jamais appelé par aucun store/page aujourd'hui, on repasse par list() pour
    // rester conforme au typage sans inventer une route qui n'existe pas.
    const products = await this.list(shop_id);
    return products.find((p) => p.id === id);
  }

  async create(_shop_id: string, input: ProductInput): Promise<Product> {
    return apiFetch<Product>('/products', { method: 'POST', body: input });
  }

  async update(_shop_id: string, id: string, input: Partial<ProductInput>): Promise<Product> {
    return apiFetch<Product>(`/products/${id}`, { method: 'PUT', body: input });
  }

  async remove(_shop_id: string, id: string): Promise<void> {
    await apiFetch<{ ok: true }>(`/products/${id}`, { method: 'DELETE' });
  }

  async adjustStock(_shop_id: string, id: string, delta: number): Promise<Product> {
    return apiFetch<Product>(`/products/${id}/adjust-stock`, { method: 'POST', body: { delta } });
  }
}

export const productsService = new ApiProductsService();
