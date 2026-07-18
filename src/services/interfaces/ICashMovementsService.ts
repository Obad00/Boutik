import type { CashMovement, CashMovementType } from '../../types';

export interface ICashMovementsService {
  list(shop_id: string): Promise<CashMovement[]>;
  listByDay(shop_id: string, dateISO: string): Promise<CashMovement[]>;
  record(
    shop_id: string,
    type: CashMovementType,
    amount: number,
    reason: string,
    order_id?: string
  ): Promise<CashMovement>;
}
