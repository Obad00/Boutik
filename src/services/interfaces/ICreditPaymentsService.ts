import type { CreditPayment } from '../../types';

export interface ICreditPaymentsService {
  list(shop_id: string): Promise<CreditPayment[]>;
  listByCustomer(shop_id: string, customer_id: string): Promise<CreditPayment[]>;
  record(shop_id: string, customer_id: string, customer_name: string, amount: number): Promise<CreditPayment>;
}
