import type { ICategoriesService } from '../interfaces';
import type { Category } from '../../types';
import { db, uid } from './db';

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

class MockCategoriesService implements ICategoriesService {
  async list(shop_id: string): Promise<Category[]> {
    await delay();
    return db.categories.filter((c) => c.shop_id === shop_id);
  }

  async create(shop_id: string, name: string): Promise<Category> {
    await delay();
    const cat: Category = { id: uid('cat'), shop_id, name };
    db.categories.push(cat);
    return cat;
  }

  async update(shop_id: string, id: string, name: string): Promise<Category> {
    await delay();
    const c = db.categories.find((x) => x.shop_id === shop_id && x.id === id);
    if (!c) throw new Error('Catégorie introuvable pour cette boutique');
    c.name = name;
    return c;
  }

  async remove(shop_id: string, id: string): Promise<void> {
    await delay();
    const idx = db.categories.findIndex((x) => x.shop_id === shop_id && x.id === id);
    if (idx >= 0) db.categories.splice(idx, 1);
  }
}

export const categoriesService = new MockCategoriesService();
