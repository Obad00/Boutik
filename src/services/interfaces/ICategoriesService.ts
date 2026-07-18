import type { Category } from '../../types';

export interface ICategoriesService {
  list(shop_id: string): Promise<Category[]>;
  create(shop_id: string, name: string): Promise<Category>;
  update(shop_id: string, id: string, name: string): Promise<Category>;
  remove(shop_id: string, id: string): Promise<void>;
}
