import type { IStockMovementsService } from '../interfaces';
import type { StockMovement, StockMovementType } from '../../types';
import { apiFetch } from './http';

class ApiStockMovementsService implements IStockMovementsService {
  async list(_shop_id: string): Promise<StockMovement[]> {
    return apiFetch<StockMovement[]>('/stock-movements');
  }

  async listByProduct(shop_id: string, product_id: string): Promise<StockMovement[]> {
    const movements = await this.list(shop_id);
    return movements.filter((m) => m.product_id === product_id);
  }

  async record(
    _shop_id: string,
    product_id: string,
    _product_name: string,
    type: StockMovementType,
    quantity: number,
    _reason: string
  ): Promise<StockMovement> {
    // Seul le réapprovisionnement (type 'in') a un endpoint dédié côté backend —
    // les mouvements 'out' sont générés uniquement par la transaction de vente
    // (POST /orders), jamais appelés directement ici en pratique.
    if (type !== 'in') {
      throw new Error("Seuls les mouvements de type 'in' (réappro) peuvent être enregistrés directement");
    }
    return apiFetch<StockMovement>('/stock-movements/restock', {
      method: 'POST',
      body: { product_id, quantity },
    });
  }
}

export const stockMovementsService = new ApiStockMovementsService();
