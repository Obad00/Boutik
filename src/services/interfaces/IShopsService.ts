import type { Shop } from '../../types';

export interface CreateShopInput {
  name: string;
  address: string;
  phone: string;
}

export interface CreatedShop {
  shop: Shop;
  code: string;
}

export interface IShopsService {
  list(): Promise<Shop[]>;
  create(input: CreateShopInput): Promise<CreatedShop>;
  update(shop_id: string, input: Partial<CreateShopInput>): Promise<Shop>;
  getCode(shop_id: string): Promise<string | undefined>;
  /** Désactivation logique (le code d'accès cesse de fonctionner, les données sont conservées) — pas une suppression. */
  deactivate(shop_id: string): Promise<void>;
  reactivate(shop_id: string): Promise<Shop>;
}
