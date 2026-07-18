import type { ICashMovementsService } from '../interfaces';
import type { CashMovement, CashMovementType } from '../../types';
import { db, uid, nowISO } from './db';

const delay = (ms = 80) => new Promise((r) => setTimeout(r, ms));

class MockCashMovementsService implements ICashMovementsService {
  async list(shop_id: string): Promise<CashMovement[]> {
    await delay();
    return db.cashMovements
      .filter((m) => m.shop_id === shop_id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async listByDay(shop_id: string, dateISO: string): Promise<CashMovement[]> {
    await delay();
    return db.cashMovements
      .filter((m) => m.shop_id === shop_id && m.created_at.slice(0, 10) === dateISO.slice(0, 10))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async record(
    shop_id: string,
    type: CashMovementType,
    amount: number,
    reason: string,
    order_id?: string
  ): Promise<CashMovement> {
    await delay();
    const movement: CashMovement = {
      id: uid('cshmv'),
      shop_id,
      type,
      amount,
      reason,
      created_at: nowISO(),
      order_id,
    };
    db.cashMovements.push(movement);
    return movement;
  }
}

export const cashMovementsService = new MockCashMovementsService();
