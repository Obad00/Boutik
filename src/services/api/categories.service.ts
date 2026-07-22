import type { ICategoriesService } from '../interfaces';
import type { Category } from '../../types';
import { apiFetch } from './http';

class ApiCategoriesService implements ICategoriesService {
  async list(_shop_id: string): Promise<Category[]> {
    return apiFetch<Category[]>('/categories');
  }

  async create(_shop_id: string, name: string): Promise<Category> {
    return apiFetch<Category>('/categories', { method: 'POST', body: { name } });
  }

  async update(_shop_id: string, id: string, name: string): Promise<Category> {
    return apiFetch<Category>(`/categories/${id}`, { method: 'PUT', body: { name } });
  }

  async remove(_shop_id: string, id: string): Promise<void> {
    await apiFetch<{ ok: true }>(`/categories/${id}`, { method: 'DELETE' });
  }
}

export const categoriesService = new ApiCategoriesService();
