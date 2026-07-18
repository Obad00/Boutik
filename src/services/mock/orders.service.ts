import type { IOrdersService, CreateOrderInput } from '../interfaces';
import type { Order, OrderItem } from '../../types';
import { db, uid, nowISO } from './db';
import { productsService } from './products.service';
import { stockMovementsService } from './stock-movements.service';
import { cashMovementsService } from './cash-movements.service';
import { customersService } from './customers.service';

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

class MockOrdersService implements IOrdersService {
  async list(shop_id: string): Promise<Order[]> {
    await delay(100);
    return db.orders.filter((o) => o.shop_id === shop_id).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async create(shop_id: string, input: CreateOrderInput): Promise<Order> {
    await delay();

    if (input.payment_mode === 'credit' && !input.customer_id) {
      throw new Error('Un client est requis pour une vente à crédit');
    }

    const order_id = uid('ord');
    const items: OrderItem[] = input.items.map((line) => ({
      id: uid('oit'),
      order_id,
      product_id: line.product_id,
      product_name: line.product_name,
      quantity: line.quantity,
      unit_price: line.unit_price,
    }));

    const order: Order = {
      id: order_id,
      shop_id,
      created_at: nowISO(),
      items,
      total: input.total,
      payment_mode: input.payment_mode,
      customer_id: input.customer_id,
      customer_name: input.customer_name,
    };
    db.orders.push(order);

    // Décrémente le stock + trace le mouvement pour chaque article
    for (const line of input.items) {
      await productsService.adjustStock(shop_id, line.product_id, -line.quantity);
      await stockMovementsService.record(
        shop_id,
        line.product_id,
        line.product_name,
        'out',
        line.quantity,
        `Vente #${order_id.slice(-6)}`
      );
    }

    if (input.payment_mode === 'cash') {
      await cashMovementsService.record(shop_id, 'in', input.total, `Vente comptant #${order_id.slice(-6)}`, order_id);
    } else if (input.customer_id) {
      await customersService.adjustDebt(shop_id, input.customer_id, input.total);
    }

    return order;
  }
}

export const ordersService = new MockOrdersService();
