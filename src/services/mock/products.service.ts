import type { IProductsService } from '../interfaces';
import type { Product, ProductInput } from '../../types';
import { db, uid, nowISO } from './db';

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

class MockProductsService implements IProductsService {
  async list(shop_id: string): Promise<Product[]> {
    await delay();
    return db.products.filter((p) => p.shop_id === shop_id);
  }

  async get(shop_id: string, id: string): Promise<Product | undefined> {
    await delay();
    return db.products.find((p) => p.shop_id === shop_id && p.id === id);
  }

  async create(shop_id: string, input: ProductInput): Promise<Product> {
    await delay();
    const product: Product = { id: uid('prod'), shop_id, created_at: nowISO(), ...input };
    db.products.push(product);
    return product;
  }

  async update(shop_id: string, id: string, input: Partial<ProductInput>): Promise<Product> {
    await delay();
    const p = db.products.find((x) => x.shop_id === shop_id && x.id === id);
    if (!p) throw new Error('Produit introuvable pour cette boutique');
    Object.assign(p, input);
    return p;
  }

  async remove(shop_id: string, id: string): Promise<void> {
    await delay();
    const idx = db.products.findIndex((x) => x.shop_id === shop_id && x.id === id);
    if (idx >= 0) db.products.splice(idx, 1);
  }

  async adjustStock(shop_id: string, id: string, delta: number): Promise<Product> {
    await delay(60);
    const p = db.products.find((x) => x.shop_id === shop_id && x.id === id);
    if (!p) throw new Error('Produit introuvable pour cette boutique');
    p.stock_quantity += delta;
    return p;
  }
}

export const productsService = new MockProductsService();
