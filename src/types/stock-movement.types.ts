export type StockMovementType = 'in' | 'out';

export interface StockMovement {
  id: string;
  shop_id: string;
  product_id: string;
  product_name: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  created_at: string;
}
