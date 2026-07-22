import type { IOrdersService, CreateOrderInput } from '../interfaces';
import type { Order } from '../../types';
import { apiFetch } from './http';

class ApiOrdersService implements IOrdersService {
  async list(_shop_id: string): Promise<Order[]> {
    return apiFetch<Order[]>('/orders');
  }

  async create(_shop_id: string, input: CreateOrderInput): Promise<Order> {
    // Toute la logique de transaction (verrou stock, mouvements, dette/encaissement)
    // vit désormais côté serveur dans une seule requête — voir OrderController::store.
    return apiFetch<Order>('/orders', { method: 'POST', body: input });
  }
}

export const ordersService = new ApiOrdersService();
