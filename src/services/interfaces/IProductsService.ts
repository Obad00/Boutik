import type { Product, ProductInput } from '../../types';

export interface IProductsService {
  list(shop_id: string): Promise<Product[]>;
  get(shop_id: string, id: string): Promise<Product | undefined>;
  create(shop_id: string, input: ProductInput): Promise<Product>;
  update(shop_id: string, id: string, input: Partial<ProductInput>): Promise<Product>;
  remove(shop_id: string, id: string): Promise<void>;
  adjustStock(shop_id: string, id: string, delta: number): Promise<Product>;
}
