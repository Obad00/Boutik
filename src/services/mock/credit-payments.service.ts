import type { ICreditPaymentsService } from '../interfaces';
import type { CreditPayment } from '../../types';
import { db, uid, nowISO } from './db';
import { customersService } from './customers.service';
import { cashMovementsService } from './cash-movements.service';

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

class MockCreditPaymentsService implements ICreditPaymentsService {
  async list(shop_id: string): Promise<CreditPayment[]> {
    await delay();
    return db.creditPayments
      .filter((p) => p.shop_id === shop_id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async listByCustomer(shop_id: string, customer_id: string): Promise<CreditPayment[]> {
    await delay();
    return db.creditPayments
      .filter((p) => p.shop_id === shop_id && p.customer_id === customer_id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async record(shop_id: string, customer_id: string, customer_name: string, amount: number): Promise<CreditPayment> {
    await delay();
    const payment: CreditPayment = {
      id: uid('crpay'),
      shop_id,
      customer_id,
      customer_name,
      amount,
      created_at: nowISO(),
    };
    db.creditPayments.push(payment);
    // Réduit la dette du client et ajoute l'argent à la caisse du jour
    await customersService.adjustDebt(shop_id, customer_id, -amount);
    await cashMovementsService.record(shop_id, 'in', amount, `Remboursement crédit — ${customer_name}`);
    return payment;
  }
}

export const creditPaymentsService = new MockCreditPaymentsService();
