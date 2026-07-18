import type { ICustomersService } from '../interfaces';
import type { Customer, CustomerInput } from '../../types';
import { db, uid, nowISO } from './db';

const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

class MockCustomersService implements ICustomersService {
  async list(shop_id: string): Promise<Customer[]> {
    await delay();
    return db.customers.filter((c) => c.shop_id === shop_id);
  }

  async get(shop_id: string, id: string): Promise<Customer | undefined> {
    await delay();
    return db.customers.find((c) => c.shop_id === shop_id && c.id === id);
  }

  async create(shop_id: string, input: CustomerInput): Promise<Customer> {
    await delay();
    const customer: Customer = { id: uid('cust'), shop_id, current_debt: 0, created_at: nowISO(), ...input };
    db.customers.push(customer);
    return customer;
  }

  async update(shop_id: string, id: string, input: Partial<CustomerInput>): Promise<Customer> {
    await delay();
    const c = db.customers.find((x) => x.shop_id === shop_id && x.id === id);
    if (!c) throw new Error('Client introuvable pour cette boutique');
    Object.assign(c, input);
    return c;
  }

  async remove(shop_id: string, id: string): Promise<void> {
    await delay();
    const idx = db.customers.findIndex((x) => x.shop_id === shop_id && x.id === id);
    if (idx >= 0) db.customers.splice(idx, 1);
  }

  async adjustDebt(shop_id: string, id: string, delta: number): Promise<Customer> {
    await delay(60);
    const c = db.customers.find((x) => x.shop_id === shop_id && x.id === id);
    if (!c) throw new Error('Client introuvable pour cette boutique');
    c.current_debt = Math.max(0, c.current_debt + delta);
    return c;
  }
}

export const customersService = new MockCustomersService();
