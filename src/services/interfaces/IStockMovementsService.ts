import type { StockMovement, StockMovementType } from '../../types';

export interface IStockMovementsService {
  list(shop_id: string): Promise<StockMovement[]>;
  listByProduct(shop_id: string, product_id: string): Promise<StockMovement[]>;
  record(
    shop_id: string,
    product_id: string,
    product_name: string,
    type: StockMovementType,
    quantity: number,
    reason: string
  ): Promise<StockMovement>;
}
