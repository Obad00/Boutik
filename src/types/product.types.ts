export type ProductUnit = 'piece' | 'sachet' | 'carton' | 'kg' | 'litre' | 'boite';

export const UNIT_LABELS: Record<ProductUnit, string> = {
  piece: 'pièce',
  sachet: 'sachet',
  carton: 'carton',
  kg: 'kg',
  litre: 'litre',
  boite: 'boîte',
};

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  price_sell: number;
  price_buy?: number;
  category_id: string;
  unit: ProductUnit;
  stock_quantity: number;
  stock_alert_threshold: number;
  created_at: string;
}

export interface ProductInput {
  name: string;
  price_sell: number;
  price_buy?: number;
  category_id: string;
  unit: ProductUnit;
  stock_quantity: number;
  stock_alert_threshold: number;
}
