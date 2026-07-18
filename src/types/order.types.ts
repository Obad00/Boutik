export type PaymentMode = 'cash' | 'credit';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  shop_id: string;
  created_at: string;
  items: OrderItem[];
  total: number;
  payment_mode: PaymentMode;
  customer_id?: string;
  customer_name?: string;
}

export interface CartLine {
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  unit: string;
  stock_available: number;
}
