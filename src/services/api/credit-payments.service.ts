import type { ICreditPaymentsService } from '../interfaces';
import type { CreditPayment } from '../../types';
import { apiFetch } from './http';

class ApiCreditPaymentsService implements ICreditPaymentsService {
  async list(_shop_id: string): Promise<CreditPayment[]> {
    return apiFetch<CreditPayment[]>('/credit-payments');
  }

  async listByCustomer(shop_id: string, customer_id: string): Promise<CreditPayment[]> {
    const payments = await this.list(shop_id);
    return payments.filter((p) => p.customer_id === customer_id);
  }

  async record(_shop_id: string, customer_id: string, _customer_name: string, amount: number): Promise<CreditPayment> {
    return apiFetch<CreditPayment>('/credit-payments', { method: 'POST', body: { customer_id, amount } });
  }
}

export const creditPaymentsService = new ApiCreditPaymentsService();
