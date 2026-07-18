export type CashMovementType = 'in' | 'out';

export interface CashMovement {
  id: string;
  shop_id: string;
  type: CashMovementType;
  amount: number;
  reason: string;
  created_at: string;
  order_id?: string;
}
