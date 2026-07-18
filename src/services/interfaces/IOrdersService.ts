import type { Order, CartLine, PaymentMode } from '../../types';

export interface CreateOrderInput {
  items: CartLine[];
  total: number;
  payment_mode: PaymentMode;
  customer_id?: string;
  customer_name?: string;
}

export interface IOrdersService {
  list(shop_id: string): Promise<Order[]>;
  create(shop_id: string, input: CreateOrderInput): Promise<Order>;
}
