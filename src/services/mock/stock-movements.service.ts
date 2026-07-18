import type { IStockMovementsService } from '../interfaces';
import type { StockMovement, StockMovementType } from '../../types';
import { db, uid, nowISO } from './db';

const delay = (ms = 80) => new Promise((r) => setTimeout(r, ms));

class MockStockMovementsService implements IStockMovementsService {
  async list(shop_id: string): Promise<StockMovement[]> {
    await delay();
    return db.stockMovements
      .filter((m) => m.shop_id === shop_id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async listByProduct(shop_id: string, product_id: string): Promise<StockMovement[]> {
    await delay();
    return db.stockMovements
      .filter((m) => m.shop_id === shop_id && m.product_id === product_id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async record(
    shop_id: string,
    product_id: string,
    product_name: string,
    type: StockMovementType,
    quantity: number,
    reason: string
  ): Promise<StockMovement> {
    await delay();
    const movement: StockMovement = {
      id: uid('stkmv'),
      shop_id,
      product_id,
      product_name,
      type,
      quantity,
      reason,
      created_at: nowISO(),
    };
    db.stockMovements.push(movement);
    return movement;
  }
}

export const stockMovementsService = new MockStockMovementsService();
