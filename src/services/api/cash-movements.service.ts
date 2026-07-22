import type { ICashMovementsService } from '../interfaces';
import type { CashMovement, CashMovementType } from '../../types';
import { apiFetch } from './http';

class ApiCashMovementsService implements ICashMovementsService {
  async list(_shop_id: string): Promise<CashMovement[]> {
    return apiFetch<CashMovement[]>('/cash-movements');
  }

  async listByDay(shop_id: string, dateISO: string): Promise<CashMovement[]> {
    const day = dateISO.slice(0, 10);
    const movements = await this.list(shop_id);
    return movements.filter((m) => m.created_at.slice(0, 10) === day);
  }

  async record(
    _shop_id: string,
    type: CashMovementType,
    amount: number,
    reason: string,
    _order_id?: string
  ): Promise<CashMovement> {
    // Les mouvements liés à une vente sont créés par la transaction POST /orders
    // côté serveur ; ce endpoint sert aux mouvements manuels (appoint, dépense).
    return apiFetch<CashMovement>('/cash-movements', { method: 'POST', body: { type, amount, reason } });
  }
}

export const cashMovementsService = new ApiCashMovementsService();
